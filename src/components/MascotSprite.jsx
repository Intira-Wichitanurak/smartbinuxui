import { useMemo, useRef, useState } from "react";

const MASCOT_CANDIDATES = [
  "/mascot/hippo-mascot.png",
  "/mascot/hippo-mascot.jpg",
  "/mascot/hippo.png",
];

export default function MascotSprite({ mood = "normal" }) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const wrapRef = useRef(null);

  const mascotSrc = useMemo(
    () => MASCOT_CANDIDATES[Math.min(candidateIndex, MASCOT_CANDIDATES.length - 1)],
    [candidateIndex],
  );

  const handleImageError = () => {
    if (candidateIndex < MASCOT_CANDIDATES.length - 1) {
      setCandidateIndex((prev) => prev + 1);
      return;
    }
    setUseFallback(true);
  };

  const updateParallax = (clientX, clientY) => {
    if (!wrapRef.current) {
      return;
    }

    const rect = wrapRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    wrapRef.current.style.setProperty("--tilt-x", `${clamp(x) * 5}deg`);
    wrapRef.current.style.setProperty("--tilt-y", `${clamp(-y) * 5}deg`);
    wrapRef.current.style.setProperty("--shift-x", `${clamp(x) * 6}px`);
    wrapRef.current.style.setProperty("--shift-y", `${clamp(y) * 5}px`);
  };

  const resetParallax = () => {
    if (!wrapRef.current) {
      return;
    }
    wrapRef.current.style.setProperty("--tilt-x", "0deg");
    wrapRef.current.style.setProperty("--tilt-y", "0deg");
    wrapRef.current.style.setProperty("--shift-x", "0px");
    wrapRef.current.style.setProperty("--shift-y", "0px");
  };

  if (!useFallback) {
    return (
      <div className={`mascot-shell mascot-shell-${mood}`} aria-hidden="true">
        <div className="mascot-aura"></div>
        <div
          ref={wrapRef}
          className={`mascot-photo-wrap mascot-photo-${mood}`}
          onPointerMove={(event) => updateParallax(event.clientX, event.clientY)}
          onPointerLeave={resetParallax}
          onPointerCancel={resetParallax}
          onTouchMove={(event) => {
            const touch = event.touches?.[0];
            if (touch) {
              updateParallax(touch.clientX, touch.clientY);
            }
          }}
          onTouchEnd={resetParallax}
        >
          <div className="mascot-photo-gloss"></div>
          <img
            src={mascotSrc}
            alt=""
            className="mascot-photo"
            onError={handleImageError}
          />
        </div>
        <div className="mascot-shadow"></div>
      </div>
    );
  }

  return (
    <div className="mascot-shell" aria-hidden="true">
      <div className={`mascot mascot-standing mascot-${mood}`}>
        <div className="ear ear-left"></div>
        <div className="ear ear-right"></div>
        <div className="head">
          <span className="eye eye-left"><span className="pupil"></span></span>
          <span className="eye eye-right"><span className="pupil"></span></span>
          <span className="blush blush-left"></span>
          <span className="blush blush-right"></span>
          <span className="nose"></span>
          <span className="mouth"><span className="tongue"></span></span>
        </div>
        <div className="body"></div>
        <div className="paw paw-left"></div>
        <div className="paw paw-right"></div>
        <div className="leg leg-left"></div>
        <div className="leg leg-right"></div>
      </div>
      <div className="mascot-shadow"></div>
    </div>
  );
}
