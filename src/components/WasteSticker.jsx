const STICKERS = {
  recyclable: {
    icon: "♻️",
    title: "รีไซเคิล",
    className: "sticker-recyclable",
  },
  hazardous: {
    icon: "☣️",
    title: "อันตราย",
    className: "sticker-hazardous",
  },
  organic: {
    icon: "🍌",
    title: "ขยะสด",
    className: "sticker-organic",
  },
  general: {
    icon: "🗑️",
    title: "ทั่วไป",
    className: "sticker-general",
  },
};

export default function WasteSticker({ type }) {
  if (!type || !STICKERS[type]) {
    return null;
  }

  const sticker = STICKERS[type];

  return (
    <div className={`waste-sticker ${sticker.className}`}>
      <span className="waste-sticker-icon" aria-hidden="true">
        {sticker.icon}
      </span>
      <span className="waste-sticker-title">{sticker.title}</span>
    </div>
  );
}
