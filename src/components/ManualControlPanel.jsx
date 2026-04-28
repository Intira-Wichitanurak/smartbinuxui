import { useState } from "react";
import { STATUS } from "../constants/statusFlow";

const MAIN_STATES = [
  { label: "1 พร้อมรอขยะ", status: STATUS.READY },
  { label: "2 ถ่ายภาพ", status: STATUS.CAPTURING },
  { label: "3 กำลังวิเคราะห์", status: STATUS.ANALYZING },
];

const RESULT_STATES = [
  { label: "4 รีไซเคิล", status: STATUS.RECYCLABLE },
  { label: "5 อันตราย", status: STATUS.HAZARDOUS },
  { label: "6 ขยะสด", status: STATUS.ORGANIC },
  { label: "7 ขยะทั่วไป", status: STATUS.GENERAL },
  { label: "8 พบเศษอาหาร", status: STATUS.FOOD_RESIDUE },
  { label: "9 ไม่แน่ใจ", status: STATUS.UNKNOWN },
  { label: "10 ขอบคุณ", status: STATUS.THANK_YOU }
];
export default function ManualControlPanel({
  currentStatus,
  isAutoFlowEnabled,
  onSetStatus,
  onAnalyze,
  onResultFromModel,
  onAutoFlowToggle,
  isAnalyzing,
  hasResult,
  audioSettings,
  onCharacterChange,
  onFontModeChange,
  onNarrationVolumeChange,
  onSfxVolumeChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "ซ่อนแผงแมนนวล" : "เปิดแผงแมนนวล"}
        className="manual-fab"
      >
        <span className="manual-fab-icon" aria-hidden="true">🎮</span>
      </button>

      <section className={`manual-panel ${isOpen ? "is-open" : "is-closed"}`}>
        <h2 className="text-lg font-bold text-emerald-900">โหมดแมนนวล</h2>
        <p className="text-sm text-emerald-800">
          โหมดพิเศษของฮิปโปน้อย กดเปลี่ยนสถานะเองได้เลย เหมาะกับเดโมและทดลองเล่น
        </p>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => onAutoFlowToggle(!isAutoFlowEnabled)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              isAutoFlowEnabled
                ? "border-rose-600 bg-rose-600 text-white hover:bg-rose-700"
                : "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800"
            }`}
          >
            {isAutoFlowEnabled ? "หยุดเล่นอัตโนมัติ" : "เปิดเล่นอัตโนมัติ"}
          </button>
        </div>

        <div className="mt-3 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
          <label className="block text-xs font-bold text-emerald-900">
            คาแรกเตอร์เสียงฮิปโปน้อย
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onCharacterChange("female")}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                audioSettings.character === "female"
                  ? "border-fuchsia-600 bg-fuchsia-600 text-white"
                  : "border-fuchsia-200 bg-white text-fuchsia-700"
              }`}
            >
              ฮิปโปน้อยหญิง
            </button>
            <button
              type="button"
              onClick={() => onCharacterChange("male")}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                audioSettings.character === "male"
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-indigo-200 bg-white text-indigo-700"
              }`}
            >
              ฮิปโปน้อยชาย
            </button>
          </div>

          <label className="block text-xs font-bold text-emerald-900">
            โหมดฟอนต์ RDKonmek
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onFontModeChange("headings")}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                audioSettings.fontMode === "headings"
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-emerald-200 bg-white text-emerald-800"
              }`}
            >
              เฉพาะหัวข้อ
            </button>
            <button
              type="button"
              onClick={() => onFontModeChange("all")}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                audioSettings.fontMode === "all"
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-emerald-200 bg-white text-emerald-800"
              }`}
            >
              ทั้งระบบ
            </button>
          </div>

          <label className="block text-xs font-bold text-emerald-900">
            ความดังเสียงพูด: {Math.round(audioSettings.narrationVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(audioSettings.narrationVolume * 100)}
            onChange={(event) => onNarrationVolumeChange(Number(event.target.value) / 100)}
            className="audio-slider"
          />

          <label className="block text-xs font-bold text-emerald-900">
            ความดังเอฟเฟกต์เกม: {Math.round(audioSettings.sfxVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(audioSettings.sfxVolume * 100)}
            onChange={(event) => onSfxVolumeChange(Number(event.target.value) / 100)}
            className="audio-slider"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {MAIN_STATES.map((item) => (
            <button
              key={item.status}
              type="button"
              onClick={() => onSetStatus(item.status)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                currentStatus === item.status
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {isAnalyzing ? "กำลังวิเคราะห์..." : "สั่งวิเคราะห์จากโมเดล"}
          </button>
          <button
            type="button"
            onClick={onResultFromModel}
            disabled={!hasResult}
            className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            ไปผลลัพธ์ตามโมเดล
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {RESULT_STATES.map((item) => (
            <button
              key={item.status}
              type="button"
              onClick={() => onSetStatus(item.status)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                currentStatus === item.status
                  ? "border-violet-700 bg-violet-700 text-white"
                  : "border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
