import { useEffect, useRef } from "react";

function playTone(context, frequency, startTime, duration, gain = 0.05) {
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, startTime);

  amp.gain.setValueAtTime(0, startTime);
  amp.gain.linearRampToValueAtTime(gain, startTime + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(amp);
  amp.connect(context.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

function clampVolume(value, fallback) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, value));
}

export function useStatusSfx(status, volume = 0.28) {
  const prevStatusRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    if (prevStatusRef.current === null) {
      prevStatusRef.current = status;
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      prevStatusRef.current = status;
      return;
    }

    if (!contextRef.current) {
      contextRef.current = new AudioCtx();
    }

    const context = contextRef.current;
    const now = context.currentTime;
    const mix = clampVolume(volume, 0.28);

    try {
      if (status === "ANALYZING") {
        playTone(context, 420, now, 0.08, 0.032 * mix);
        playTone(context, 560, now + 0.1, 0.08, 0.028 * mix);
      } else if (status === "THANK_YOU") {
        playTone(context, 520, now, 0.12, 0.045 * mix);
        playTone(context, 660, now + 0.14, 0.13, 0.054 * mix);
      } else {
        playTone(context, 620, now, 0.09, 0.03 * mix);
      }
    } catch {
      // Ignore sound failures to avoid blocking UI transitions.
    }

    prevStatusRef.current = status;
  }, [status]);
}
