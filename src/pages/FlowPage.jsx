import StatusScene from "../components/StatusScene";
import { STATUS } from "../constants/statusFlow";

const CONTENT = {
  [STATUS.READY]: {
    title: "ฮิปโปน้อยพร้อมลุย",
    subtitle: "ส่งขยะมาได้เลยจ้า ฮิปโปน้อยจะช่วยแยกให้แบบสนุกๆ",
    badge: "พร้อมเริ่มเกมแยกขยะ",
    mood: "happy",
    number: 1,
  },
  [STATUS.CAPTURING]: {
    title: "ฮิปโปน้อยกำลังถ่ายภาพ",
    subtitle: "ยิ้มหน่อยจ้า กล้องกำลังเก็บภาพขยะเพื่อไปวิเคราะห์",
    badge: "กำลังบันทึกภาพ",
    mood: "focus",
    number: 2,
  },
  [STATUS.ANALYZING]: {
    title: "กำลังวิเคราะห์ประเภทขยะ",
    subtitle: "ขอเวลานิดนึงนะ ฮิปโปน้อยกำลังดูว่าเป็นขยะประเภทไหน",
    badge: "กำลังประมวลผล",
    mood: "think",
    number: 3,
  },
  [STATUS.RECYCLABLE]: {
    title: "ขยะรีไซเคิล (RECYCLE)",
    subtitle: "",
    badge: "",
    mood: "happy",
    number: 4,
    heroVariant: "recyclable",
    heroImageSetKey: "recyclable",
    quoteText: "\"ดีเยี่ยม ของแบบนี้ต้องไป\nถังรีไซเคิล\nดู! ได้กลับมาใช้ใหม่ได้อีก\"",
  },
  [STATUS.HAZARDOUS]: {
    title: "ขยะอันตราย (HAZARDOUS)",
    subtitle: "",
    badge: "",
    mood: "alert",
    number: 5,
    heroVariant: "hazardous",
    heroImageSetKey: "hazardous",
    quoteText: "\"น่ารักมาก แยกถูกแล้ว ของอันตรายต้องระวังและใส่ถังสีแดง\"",
  },
  [STATUS.ORGANIC]: {
    title: "ขยะเปียก (ORGANIC)",
    subtitle: "",
    badge: "",
    mood: "happy",
    number: 6,
    heroVariant: "organic",
    heroImageSetKey: "organic",
    quoteText: "\"เก่งมากเลย ของชิ้นนี้ย่อยสลายได้ ใส่ถังสีเขียวเลย\"",
  },
  [STATUS.GENERAL]: {
    title: "ขยะทั่วไป (GENERAL)",
    subtitle: "",
    badge: "",
    mood: "normal",
    number: 7,
    heroVariant: "general",
    heroImageSetKey: "general",
    quoteText: "\"เก่งจัง ของชิ้นนี้รีไซเคิลไม่ได้ \nไปอยู่ถังสีน้ำเงินนะ\"",
  },
  [STATUS.FOOD_RESIDUE]: {
    title: "กรุณานำเศษอาหารเท\nลงถังขยะบางๆก่อนน้า\n!!!",
    subtitle: "",
    badge: "",
    mood: "alert",
    number: 8,
    heroVariant: "unknown",
    heroImageSetKey: "unknown",
  },
  [STATUS.UNKNOWN]: {
    title: "ลองถ่ายใหม่อีกครั้งน๊า\nคราวนี้น่าทำได้นะๆ",
    subtitle: "",
    badge: "",
    mood: "sad",
    number: 9,
    heroVariant: "retry",
    heroImageSetKey: "retry",
  },
  [STATUS.THANK_YOU]: {
    title: "ขอบคุณที่มาช่วยกัน\nคัดแยกขยะกับฉันนะ",
    subtitle: "",
    badge: "",
    mood: "celebrate",
    number: 10,
    heroVariant: "thankyou",
    heroImageSetKey: "thankyou",
  },
};

export default function FlowPage({
  status,
  result,
  narrationText,
  videoRef,
  cameraError,
}) {
  const content = CONTENT[status] ?? CONTENT[STATUS.UNKNOWN];

  return (
    <>
      <StatusScene
        status={status}
        stepNumber={content.number}
        title={content.title}
        subtitle={content.subtitle}
        badge={content.badge}
        mood={content.mood}
        narrationText={narrationText}
        videoRef={videoRef}
        showVideo={status === STATUS.CAPTURING}
        stickerType={content.stickerType}
        heroVariant={content.heroVariant}
        heroImageSetKey={content.heroImageSetKey}
        quoteText={content.quoteText}
        hideNarration={status === STATUS.UNKNOWN}
      />

      {cameraError ? (
        <p className="pointer-events-none fixed left-1/2 top-4 z-30 w-[min(92vw,560px)] -translate-x-1/2 rounded-2xl border border-rose-200 bg-rose-50/95 px-4 py-2 text-sm font-semibold text-rose-700 shadow-lg">
          {cameraError}
        </p>
      ) : null}

    </>
  );
}
