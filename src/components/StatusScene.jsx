import MascotSprite from "./MascotSprite";
import WasteSticker from "./WasteSticker";

export default function StatusScene({
  status,
  stepNumber,
  title,
  subtitle,
  badge,
  mood,
  narrationText,
  showVideo = false,
  videoRef,
  stickerType,
}) {
  const themeClass = `status-theme-${String(status || "ready").toLowerCase()}`;

  return (
    <main className={`status-main ${themeClass} min-h-screen overflow-hidden px-3 py-3 sm:px-5 sm:py-4`}>
      <section className="scene-wrap phone-scene-shell mx-auto w-full max-w-5xl">
        <article className="status-card scene-card phone-card mx-auto">
          <header className="phone-head">
            <span className="phone-brand">Smart Trash</span>
            <span className="phone-step">{`Screen ${stepNumber || "-"}`}</span>
          </header>

          <div className="phone-layout">
            <div className="status-media phone-media relative">
              {showVideo ? (
                <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl border-4 border-white/90 bg-slate-900">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <span className="camera-tag">REC</span>
                </div>
              ) : (
                <MascotSprite mood={mood} />
              )}
            </div>

            <div className="status-copy phone-copy">
              <h1 className="scene-title phone-title">{title}</h1>
              {subtitle ? <p className="phone-subtitle">{subtitle}</p> : null}

              <div className="phone-footer">
                {stickerType ? <WasteSticker type={stickerType} /> : null}

                <p className="narration-bubble phone-bubble text-sm font-semibold">
                  <span className="narration-label">เสียงฮิปโปน้อย:</span>{" "}
                  <span className="narration-text">{narrationText}</span>
                </p>

                {badge ? <p className="phone-badge">{badge}</p> : null}
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
