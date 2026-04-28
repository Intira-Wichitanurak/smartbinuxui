import { useState } from "react";
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
  heroVariant,
  heroImageSetKey,
  quoteText,
  hideNarration = false,
}) {
  const themeClass = `status-theme-${String(status || "ready").toLowerCase()}`;
  const isReady = status === "READY";
  const isCapturing = status === "CAPTURING";
  const isAnalyzing = status === "ANALYZING";
  const isResultHero = Boolean(heroVariant);
  const [binsImageFailed, setBinsImageFailed] = useState(false);

  return (
    <main className={`status-main ${themeClass} min-h-screen overflow-hidden px-3 py-3 sm:px-5 sm:py-4`}>
      <section className="scene-wrap phone-scene-shell mx-auto w-full max-w-5xl">
        <article className="status-card scene-card phone-card mx-auto">
          <header className="phone-head">
            <span className="phone-brand">Smart Trash</span>
            <span className="phone-step">{`Screen ${stepNumber || "-"}`}</span>
          </header>

          <div className={`phone-layout${isReady || isCapturing || isAnalyzing || isResultHero ? " phone-layout-ready" : ""}`}>
            <div className="status-media phone-media relative">
              {isCapturing ? (
                <div className="capture-hero" aria-hidden="true">
                  <span className="capture-hero-brand">SMARTBIN</span>
                  <h2 className="capture-hero-title">{title || "กำลังจับภาพ"}</h2>

                  <div className="capture-hero-mascot">
                    <MascotSprite mood="focus" imageSetKey="capturing" />
                  </div>

                  <div className="capture-screen-frame">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="capture-screen-video"
                    />
                    <span className="capture-rec">REC</span>
                    <span className="capture-corner capture-corner-tl"></span>
                    <span className="capture-corner capture-corner-tr"></span>
                    <span className="capture-corner capture-corner-bl"></span>
                    <span className="capture-corner capture-corner-br"></span>
                    <span className="capture-target"></span>
                  </div>
                </div>
              ) : isAnalyzing ? (
                <div className="analyze-hero" aria-hidden="true">
                  <span className="analyze-hero-brand">SMARTBIN</span>
                  <h2 className="analyze-hero-title">{title || "กำลังวิเคราะห์ประเภทขยะ"}</h2>

                  <div className="analyze-loading-wrap">
                    <span className="analyze-loading-label">LOADING ...</span>
                    <div className="analyze-loading-bar">
                      <span className="analyze-loading-fill"></span>
                    </div>
                  </div>

                  <div className="analyze-hero-mascot">
                    <MascotSprite mood="think" imageSetKey="analyzing" />
                  </div>

                  <span className="analyze-bin" aria-hidden="true"></span>
                </div>
              ) : isResultHero ? (
                <div className={`result-hero result-hero-${heroVariant}`} aria-hidden="true">
                  <span className="result-hero-brand">SMARTBIN</span>
                  <h2 className="result-hero-title">{title}</h2>
                  {subtitle ? <p className="result-hero-subtitle">{subtitle}</p> : null}

                  <div className="result-hero-mascot">
                    <MascotSprite mood="happy" imageSetKey={heroImageSetKey || "default"} />
                  </div>

                  {quoteText ? <p className="result-hero-quote">{quoteText}</p> : null}
                </div>
              ) : showVideo ? (
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
              ) : isReady ? (
                <div className="ready-hero" aria-hidden="true">
                  <span className="ready-hero-standby">STANDBY</span>
                  <h2 className="ready-hero-logo">SMARTBIN</h2>
                  <div className="ready-hero-mascot">
                    <MascotSprite mood="happy" />
                  </div>
                  <div className="ready-bin-row">
                    {!binsImageFailed ? (
                      <img
                        src="/trush.png"
                        alt=""
                        className="ready-bin-image"
                        onError={() => setBinsImageFailed(true)}
                      />
                    ) : (
                      <>
                        <span className="ready-bin ready-bin-green"></span>
                        <span className="ready-bin ready-bin-blue"></span>
                        <span className="ready-bin ready-bin-yellow"></span>
                        <span className="ready-bin ready-bin-red"></span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <MascotSprite mood={mood} />
              )}
            </div>

            {!isReady && !isCapturing && !isAnalyzing && !isResultHero ? (
              <div className="status-copy phone-copy">
                <h1 className="scene-title phone-title">{title}</h1>
                {subtitle ? <p className="phone-subtitle">{subtitle}</p> : null}

                <div className="phone-footer">
                  {stickerType ? <WasteSticker type={stickerType} /> : null}

                  {!hideNarration ? (
                    <p className="narration-bubble phone-bubble text-sm font-semibold">
                      <span className="narration-label">เสียงฮิปโปน้อย:</span>{" "}
                      <span className="narration-text">{narrationText}</span>
                    </p>
                  ) : null}

                  {badge ? <p className="phone-badge">{badge}</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}
