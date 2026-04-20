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
    title: "ฮิปโปน้อยกำลังคิด",
    subtitle: "ขอเวลานิดนึงนะ ฮิปโปน้อยกำลังดูว่าเป็นขยะประเภทไหน",
    badge: "กำลังประมวลผล",
    mood: "think",
    number: 3,
  },
  [STATUS.RECYCLABLE]: {
    title: "เย้ เจอขยะรีไซเคิล",
    subtitle: "เก่งมากเลยจ้า เอาไปใส่ถังรีไซเคิลให้กลับมาใช้ใหม่ได้",
    badge: "ประเภทที่ 1",
    mood: "happy",
    number: 5,
    stickerType: "recyclable",
  },
  [STATUS.HAZARDOUS]: {
    title: "อุ๊ย เจอขยะอันตราย",
    subtitle: "ฮิปโปน้อยขอเตือน แยกทิ้งในจุดรับขยะอันตรายนะ ปลอดภัยที่สุด",
    badge: "ประเภทที่ 2",
    mood: "alert",
    number: 6,
    stickerType: "hazardous",
  },
  [STATUS.ORGANIC]: {
    title: "เจอขยะสดจ้า",
    subtitle: "สุดยอดเลย นี่คือขยะสด เอาไปทำปุ๋ยหมักต่อได้",
    badge: "ประเภทที่ 3",
    mood: "happy",
    number: 7,
    stickerType: "organic",
  },
  [STATUS.GENERAL]: {
    title: "เจอขยะทั่วไป",
    subtitle: "ทิ้งลงถังขยะทั่วไปได้เลย แล้วอย่าปนกับรีไซเคิลนะ",
    badge: "ประเภทที่ 4",
    mood: "normal",
    number: 8,
    stickerType: "general",
  },
  [STATUS.FOOD_RESIDUE]: {
    title: "ฮิปโปน้อยเจอเศษอาหาร",
    subtitle: "ล้างก่อนทิ้งนิดนึงนะ จะช่วยให้คัดแยกได้ง่ายขึ้น",
    badge: "ตรวจพบเศษอาหาร",
    mood: "think",
    number: 9,
  },
  [STATUS.UNKNOWN]: {
    title: "ฮิปโปน้อยยังไม่แน่ใจ",
    subtitle: "ไม่เป็นไรจ้า ลองถ่ายใหม่อีกครั้ง เดี๋ยวเราช่วยกันดู",
    badge: "ต้องลองใหม่",
    mood: "sad",
    number: 10,
  },
  [STATUS.THANK_YOU]: {
    title: "ขอบคุณจากฮิปโปน้อย",
    subtitle: "ขอบคุณที่ช่วยกันแยกขยะนะ เด็กเก่งรักษ์โลกสุดๆ",
    badge: "พร้อมเล่นรอบใหม่",
    mood: "celebrate",
    number: 11,
  },
};

export default function FlowPage({
  status,
  result,
  narrationText,
  videoRef,
  cameraError,
}) {
  const content = CONTENT[status];

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
      />

      {cameraError ? (
        <p className="pointer-events-none fixed left-1/2 top-4 z-30 w-[min(92vw,560px)] -translate-x-1/2 rounded-2xl border border-rose-200 bg-rose-50/95 px-4 py-2 text-sm font-semibold text-rose-700 shadow-lg">
          {cameraError}
        </p>
      ) : null}

    </>
  );
}
