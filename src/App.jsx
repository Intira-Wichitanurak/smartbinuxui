import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { STATUS, STATUS_ROUTE } from "./constants/statusFlow";
import ManualControlPanel from "./components/ManualControlPanel";
import { useNarration } from "./hooks/useNarration";
import { useStatusSfx } from "./hooks/useStatusSfx";
import { useWasteFlow } from "./hooks/useWasteFlow";
import FlowPage from "./pages/FlowPage";

const AUDIO_SETTINGS_KEY = "hippo-audio-settings";

const ROUTED_STATUSES = [
  STATUS.READY,
  STATUS.CAPTURING,
  STATUS.ANALYZING,
  STATUS.RECYCLABLE,
  STATUS.HAZARDOUS,
  STATUS.ORGANIC,
  STATUS.GENERAL,
  STATUS.FOOD_RESIDUE,
  STATUS.UNKNOWN,
  STATUS.THANK_YOU,
];

function App() {
  const [audioSettings, setAudioSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY) || "{}");
      return {
        character: saved.character === "male" ? "male" : "female",
        fontMode: saved.fontMode === "all" ? "all" : "headings",
        narrationVolume:
          typeof saved.narrationVolume === "number" ? saved.narrationVolume : 0.52,
        sfxVolume: typeof saved.sfxVolume === "number" ? saved.sfxVolume : 0.28,
      };
    } catch {
      return {
        character: "female",
        fontMode: "headings",
        narrationVolume: 0.52,
        sfxVolume: 0.28,
      };
    }
  });

  const {
    status,
    result,
    videoRef,
    cameraError,
    isAnalyzing,
    forceStatus,
    forceAnalyze,
    goToResultFromModel,
  } = useWasteFlow();
  const { narrationText } = useNarration(status, audioSettings);
  useStatusSfx(status, audioSettings.sfxVolume);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioSettings));
  }, [audioSettings]);

  useEffect(() => {
    document.body.classList.remove("font-mode-headings", "font-mode-all");
    document.body.classList.add(
      audioSettings.fontMode === "all" ? "font-mode-all" : "font-mode-headings",
    );
  }, [audioSettings.fontMode]);

  useEffect(() => {
    navigate(STATUS_ROUTE[status], { replace: true });
  }, [navigate, status]);

  return (
    <>
      <Routes>
        {ROUTED_STATUSES.map((routeStatus) => (
          <Route
            key={routeStatus}
            path={STATUS_ROUTE[routeStatus]}
            element={
              <FlowPage
                status={routeStatus}
                result={result}
                narrationText={narrationText}
                videoRef={videoRef}
                cameraError={cameraError}
              />
            }
          />
        ))}
        <Route path="*" element={<Navigate to={STATUS_ROUTE[STATUS.READY]} replace />} />
      </Routes>

      <ManualControlPanel
        currentStatus={status}
        onSetStatus={forceStatus}
        onAnalyze={forceAnalyze}
        onResultFromModel={goToResultFromModel}
        isAnalyzing={isAnalyzing}
        hasResult={Boolean(result)}
        audioSettings={audioSettings}
        onCharacterChange={(character) =>
          setAudioSettings((prev) => ({ ...prev, character }))
        }
        onFontModeChange={(fontMode) => setAudioSettings((prev) => ({ ...prev, fontMode }))}
        onNarrationVolumeChange={(narrationVolume) =>
          setAudioSettings((prev) => ({ ...prev, narrationVolume }))
        }
        onSfxVolumeChange={(sfxVolume) =>
          setAudioSettings((prev) => ({ ...prev, sfxVolume }))
        }
      />
    </>
  );
}

export default App;
