import { useEffect, useRef } from "react";

const LINES_BY_STATUS = {
  READY: [
    "ฮิปโปน้อยรออยู่จ้า ส่งขยะมาให้เราช่วยกันแยกนะ"
  ],
  CAPTURING: [
    "เก่งมาก อยู่นิ่งแบบซูเปอร์ฮีโร่อีกแป๊บเดียวนะ"
  ],
  ANALYZING: [
    "ขอเวลานิดนึงนะ ฮิปโปน้อยกำลังหาคำตอบให้เพื่อนคนเก่ง"
  ],
  ANALYZED: [
    "ได้ผลแล้วจ้า มาดูกันว่าเราแยกถูกไหม"
  ],
  RECYCLABLE: [
    "เย่ เก่งมาก นี่คือขยะรีไซเคิล เอาไปใส่ถังรีไซเคิลให้กลับมาใช้ใหม่ได้เลย"
    
  ],
  HAZARDOUS: [
    "เพื่อนคนเก่งเจอขยะอันตรายแล้ว วางลงถังเฉพาะนะ"
   
  ],
  ORGANIC: [
    "ฮิปโปน้อยชอบมาก ขยะสดแบบนี้ช่วยโลกได้จ้า"
  ],
  GENERAL: [
    "ฮิปโปน้อย ว่าอันนี้เป็นขยะทั่วไป ถังสีเหลืองจ้าา"
  ],
  FOOD_RESIDUE: [
    "ฮิปโปน้อยเจอเศษอาหารติดอยู่ ช่วยเขี่ยลงถังเศษอาหารให้หน่อยน้าา แล้วค่อยนำกลับคัดแยกอีกครั้งนะ"
    
  ],
  UNKNOWN: [
    "เก่งแล้วจ้า แค่ถ่ายใหม่ชัดๆ อีกครั้งก็โอเคเลย"
  ],
  THANK_YOU: [
    "ขอบคุณเพื่อนตัวน้อย เก่งมากที่ช่วยฮิปโปน้อยรักษ์โลก"
  ],
};

const AUDIO_FILE_BY_STATUS = {
  READY: "ready.mp3",
  CAPTURING: "capturing.mp3",
  ANALYZING: "analyzing.mp3",
  ANALYZED: "analyzed.mp3",
  RECYCLABLE: "recyclable.mp3",
  HAZARDOUS: "hazardous.mp3",
  ORGANIC: "organic.mp3",
  GENERAL: "general.mp3",
  FOOD_RESIDUE: "food_residue.mp3",
  UNKNOWN: "unknown.mp3",
  THANK_YOU: "thank_you.mp3",
};

function clampVolume(value, fallback) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, value));
}

export function useNarration(status, audioSettings) {
  const audioRef = useRef(null);
  const currentLineRef = useRef("");

  if (!currentLineRef.current || !LINES_BY_STATUS[status]?.includes(currentLineRef.current)) {
    const options = LINES_BY_STATUS[status] || [""];
    currentLineRef.current = options[Math.floor(Math.random() * options.length)] || "";
  }

  useEffect(() => {
    const audioFile = AUDIO_FILE_BY_STATUS[status];
    const character = audioSettings?.character === "male" ? "male" : "female";
    const baseVolume = clampVolume(
      audioSettings?.narrationVolume,
      status === "HAZARDOUS" ? 0.6 : 0.52,
    );
    let cancelled = false;

    const speakFallback = () => {
      if (!("speechSynthesis" in window)) {
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentLineRef.current);
      utterance.lang = "th-TH";
      utterance.rate = character === "male" ? 0.96 : 1;
      utterance.pitch = character === "male" ? 0.94 : 1.18;
      utterance.volume = baseVolume;
      window.speechSynthesis.speak(utterance);
    };

    async function playRecorded() {
      const candidates = [
        `/audio/${character}/${audioFile}`,
        `/audio/${audioFile}`,
      ];

      for (const src of candidates) {
        if (cancelled) {
          return false;
        }

        const audio = new Audio(src);
        audio.volume = baseVolume;

        try {
          await audio.play();
          if (cancelled) {
            audio.pause();
            audio.currentTime = 0;
            return false;
          }
          audioRef.current = audio;
          return true;
        } catch {
          // Try next source.
        }
      }

      return false;
    }

    playRecorded().then((played) => {
      if (!played && !cancelled) {
        speakFallback();
      }
    });

    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.speechSynthesis?.cancel();
    };
  }, [audioSettings?.character, audioSettings?.narrationVolume, status]);

  return { narrationText: currentLineRef.current };
}
