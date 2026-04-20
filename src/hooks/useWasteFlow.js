import { useCallback, useEffect, useRef, useState } from "react";
import {
  RESULT_STATUSES,
  STATUS,
  TIMINGS_MS,
  resolveResultStatus,
} from "../constants/statusFlow";
import { classifyWaste } from "../services/mockClassifier";

export function useWasteFlow() {
  const [status, setStatus] = useState(STATUS.READY);
  const [result, setResult] = useState(null);
  const [cycleCount, setCycleCount] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const frameBlobRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch {
      setCameraError("ไม่สามารถเปิดกล้องได้");
      return false;
    }
  }, []);

  const captureFrameBlob = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  }, []);

  useEffect(() => {
    let timerId;
    let cancelled = false;
    let probing = false;

    async function runStatusFlow() {
      if (status === STATUS.READY) {
        setResult(null);
        frameBlobRef.current = null;
        const opened = await startCamera();
        if (!opened || cancelled) {
          return;
        }

        const probeForWaste = async () => {
          if (cancelled || probing || status !== STATUS.READY) {
            return;
          }

          probing = true;
          try {
            const blob = await captureFrameBlob();
            if (!blob || cancelled) {
              return;
            }

            const quickPrediction = await classifyWaste(blob, {
              timeoutMs: 2500,
            });

            if (
              !cancelled &&
              quickPrediction &&
              !quickPrediction.timeout &&
              quickPrediction.type !== "unknown" &&
              Number(quickPrediction.confidence || 0) >= 0.55
            ) {
              stopCamera();
              setStatus(STATUS.CAPTURING);
              return;
            }
          } catch {
            // Ignore probe errors and keep waiting on READY.
          } finally {
            probing = false;
          }

          if (!cancelled && status === STATUS.READY) {
            timerId = setTimeout(probeForWaste, 1600);
          }
        };

        timerId = setTimeout(probeForWaste, 1200);
        return;
      }

      if (status === STATUS.CAPTURING) {
        const opened = await startCamera();
        if (!opened || cancelled) {
          setStatus(STATUS.UNKNOWN);
          return;
        }

        timerId = setTimeout(async () => {
          const blob = await captureFrameBlob();
          frameBlobRef.current = blob;
          stopCamera();
          setStatus(STATUS.ANALYZING);
        }, TIMINGS_MS.CAPTURING);
        return;
      }

      if (status === STATUS.ANALYZING) {
        setIsAnalyzing(true);
        const analyzeStartedAt = Date.now();
        try {
          let frameBlob = frameBlobRef.current;

          // Manual mode may jump directly to ANALYZING without a captured frame.
          if (!frameBlob) {
            const opened = await startCamera();
            if (opened) {
              await new Promise((resolve) => setTimeout(resolve, 320));
              frameBlob = await captureFrameBlob();
              frameBlobRef.current = frameBlob;
              stopCamera();
            }
          }

          const prediction = await classifyWaste(frameBlob, {
            timeoutMs: TIMINGS_MS.ANALYZE_TIMEOUT,
          });
          const elapsed = Date.now() - analyzeStartedAt;
          const remain = Math.max(0, TIMINGS_MS.ANALYZE_MIN - elapsed);
          if (remain > 0) {
            await new Promise((resolve) => setTimeout(resolve, remain));
          }
          if (cancelled) {
            return;
          }
          setResult(prediction);
          setStatus(resolveResultStatus(prediction));
        } catch {
          if (!cancelled) {
            setResult({ timeout: true, confidence: 0, labelText: "ไม่แน่ใจ" });
            setStatus(STATUS.UNKNOWN);
          }
        } finally {
          if (!cancelled) {
            setIsAnalyzing(false);
          }
        }
        return;
      }

      if (RESULT_STATUSES.has(status)) {
        timerId = setTimeout(() => {
          setStatus(STATUS.THANK_YOU);
        }, TIMINGS_MS.RESULT);
        return;
      }

      if (status === STATUS.THANK_YOU) {
        timerId = setTimeout(() => {
          setResult(null);
          frameBlobRef.current = null;
          stopCamera();
          setCycleCount((prev) => prev + 1);
          setStatus(STATUS.READY);
        }, TIMINGS_MS.THANK_YOU);
      }
    }

    runStatusFlow();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      if (status !== STATUS.CAPTURING) {
        stopCamera();
      }
    };
  }, [captureFrameBlob, startCamera, status, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const forceStatus = useCallback(
    (nextStatus) => {
      stopCamera();
      frameBlobRef.current = null;
      if (nextStatus === STATUS.READY) {
        setResult(null);
      }
      setStatus(nextStatus);
    },
    [stopCamera],
  );

  const forceAnalyze = useCallback(() => {
    stopCamera();
    setStatus(STATUS.ANALYZING);
  }, [stopCamera]);

  const goToResultFromModel = useCallback(() => {
    setStatus(resolveResultStatus(result));
  }, [result]);

  return {
    status,
    result,
    cycleCount,
    videoRef,
    isAnalyzing,
    cameraError,
    forceStatus,
    forceAnalyze,
    goToResultFromModel,
  };
}
