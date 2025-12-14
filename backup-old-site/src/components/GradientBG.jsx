// <!-- 
// ___________________________________________________________________________
//
//                             copyright © 2024 Jetson Black
//                             x.com/jetsonbb
//                             http://jetsonblack.com/
//
//                             just a simple page for myself!
// ___________________________________________________________________________
// -->
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

const LS_KEY = "bgMode";     // "mono" | "vibrant"
const FE_STD = 10;           // SVG Gaussian blur inside goo filter
const OUTER_BLUR_PX = 14;    // Extra CSS blur on the blob layer

/* ---------------- helpers ---------------- */
function setCSSVars(vars, el = document.documentElement) {
  Object.entries(vars).forEach(([k, v]) => el.style.setProperty(`--${k}`, v));
}

/* Palettes */
function monoPalette() {
  return {
    "color-bg1": `rgb(24, 24, 26)`,
    "color-bg2": `rgb(28, 28, 32)`,
    "color1": `40, 40, 44`,
    "color2": `50, 50, 54`,
    "color3": `60, 60, 64`,
    "color4": `45, 45, 50`,
    "color5": `55, 55, 60`,
    "color-interactive": `70, 70, 75`,
    "blending": "soft-light",
  };
}

// Time-based vibrant (softened) — morning / afternoon / night
function vibrantTimePalette(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 12) {
    return {
      "color-bg1": `rgb(255, 210, 140)`,
      "color-bg2": `rgb(255, 220, 180)`,
      "color1": `255, 180, 120`,
      "color2": `255, 190, 140`,
      "color3": `255, 200, 160`,
      "color4": `255, 160, 110`,
      "color5": `255, 210, 170`,
      "color-interactive": `255, 190, 140`,
      "blending": "hard-light",
    };
  }
  if (h >= 12 && h < 18) {
    return {
      "color-bg1": `rgb(120, 170, 230)`,
      "color-bg2": `rgb(160, 200, 240)`,
      "color1": `140, 190, 235`,
      "color2": `170, 210, 245`,
      "color3": `150, 195, 240`,
      "color4": `110, 160, 220`,
      "color5": `190, 225, 250`,
      "color-interactive": `170, 210, 245`,
      "blending": "hard-light",
    };
  }
  return {
    "color-bg1": `rgb(40, 20, 60)`,
    "color-bg2": `rgb(70, 40, 90)`,
    "color1": `100, 60, 140`,
    "color2": `80, 50, 120`,
    "color3": `60, 40, 100`,
    "color4": `140, 80, 160`,
    "color5": `90, 50, 120`,
    "color-interactive": `120, 70, 150`,
    "blending": "hard-light",
  };
}

function applyMode(mode) {
  setCSSVars(mode === "vibrant" ? vibrantTimePalette() : monoPalette());
}

/* Seeds for N blobs (incl. per-blob inertia factor pf) */
function makeSeeds(n) {
  return Array.from({ length: n }, (_, idx) => {
    const rand = (x, y) => x + Math.random() * (y - x);
    return {
      which: Math.floor(Math.random() * 3), // 0 vertical, 1 circle, 2 horizontal
      dur: Math.round(rand(18, 42)),
      ease: ["ease", "linear", "ease-in-out"][Math.floor(Math.random() * 3)],
      originX: Math.round(rand(-800, 800)),
      originY: Math.round(rand(-300, 300)),
      topOff: Math.round(rand(-150, 150)),
      leftOff: Math.round(rand(-150, 150)),
      pf: +(rand(0.35, 1.2)).toFixed(2), // per-blob inertia/parallax factor
      colorIndex: idx % 5,
    };
  });
}

const GradientBG = forwardRef(function GradientBG(
  {
    blobCount = 8,      // more blobs -> all blobs auto-shrink
    baseCircle = 0.8,   // baseline circle-size (80%)
    minCircle = 0.35,   // never shrink below 35%
    haloSize = 160,     // (unused; kept for API compatibility)
    ringSize = 20,

    // Per-blob inertia knobs (applied via global --inertiaY * pf)
    inertiaEnabled = true,
    inertiaStrength = 0.18,
    inertiaFriction = 0.90,
    inertiaSpring = 0.02,
    inertiaMax = 140,

    // Delay (no damping) after the last scroll
    inertiaGraceMs = 200,

    // Stage bleed so blur/inertia don't clip
    bleedPx = 240,
  },
  outerRef
) {
  const interactiveRef = useRef(null);
  const ringRef = useRef(null);
  const stageRef = useRef(null); // holds --inertiaY

  // Respect reduced motion by default; will further disable if FPS is low.
  const [perfOK, setPerfOK] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return true;
    }
  });

  // Mode: persisted, default 90% mono / 10% vibrant
  const [mode, setMode] = useState(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (saved === "mono" || saved === "vibrant") return saved;
    return Math.random() < 0.10 ? "vibrant" : "mono";
  });

  // Blob size scaling based on count
  useEffect(() => {
    const scale = Math.max(minCircle, baseCircle * (5 / blobCount));
    setCSSVars({ "circle-size": `${Math.round(scale * 100)}%` });
  }, [blobCount, baseCircle, minCircle]);

  // Apply palette + persist
  useEffect(() => {
    applyMode(mode);
    try { localStorage.setItem(LS_KEY, mode); } catch {}
  }, [mode]);

  // Refresh vibrant every 60s to catch hour changes
  useEffect(() => {
    if (mode !== "vibrant") return;
    const id = setInterval(() => applyMode("vibrant"), 60_000);
    return () => clearInterval(id);
  }, [mode]);

  // Shift+P toggle (testing)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "p" || e.key === "P") && e.shiftKey) {
        setMode((m) => (m === "mono" ? "vibrant" : "mono"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lightweight FPS probe: if sustained < minFPS twice in a row, disable blob logic.
  useEffect(() => {
    if (!perfOK) return; // already disabled
    let rafId;
    let frames = 0;
    let start = performance.now();
    let badStreak = 0;
    const sampleMs = 1500;  // window to sample FPS
    const minFPS = 40;      // threshold for "good enough"
    const maxBad = 2;       // consecutive bad windows before disabling

    const loop = (t) => {
      frames++;
      const elapsed = t - start;
      if (elapsed >= sampleMs) {
        const fps = (frames / elapsed) * 1000;
        if (fps < minFPS) badStreak++; else badStreak = 0;
        if (badStreak >= maxBad) {
          setPerfOK(false); // permanently disable until reload
          cancelAnimationFrame(rafId);
          return;
        }
        frames = 0;
        start = t;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [perfOK]);

  // Mouse-follow: interactive (smoothed, stage-relative) + ring (fixed overlay)
  useEffect(() => {
    if (!perfOK) return; // disable on low-FPS/reduced motion
    const inter = interactiveRef.current;
    const ring = ringRef.current;
    const stage = stageRef.current;
    if (!inter || !ring || !stage) return;

    let curX = 0, curY = 0, tgX = 0, tgY = 0, rafId;
    const ringHalf = ringSize / 2;

    const onMove = (e) => {
      tgX = e.clientX; tgY = e.clientY;
      ring.style.transform = `translate3d(${tgX - ringHalf}px, ${tgY - ringHalf}px, 0)`;
    };

    const tick = () => {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      const rect = stage.getBoundingClientRect();
      const localX = curX - rect.left;
      const localY = curY - rect.top;
      inter.style.transform = `translate3d(${Math.round(localX)}px, ${Math.round(localY)}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId); };
  }, [ringSize, perfOK]);

  // Init --inertiaY ONCE (prevents reset on re-renders)
  useEffect(() => {
    if (stageRef.current) stageRef.current.style.setProperty("--inertiaY", "0px");
  }, []);

  // Per-blob inertia with grace delay
  useEffect(() => {
    if (!perfOK || !inertiaEnabled) {
      if (stageRef.current) stageRef.current.style.setProperty("--inertiaY", "0px");
      return;
    }
    const stage = stageRef.current;
    if (!stage) return;

    let prevScrollY = window.scrollY;
    let vy = 0, y = 0, rafId;
    let graceUntil = 0; // timestamp until which damping is skipped

    const onScroll = () => {
      const cur = window.scrollY;
      const dy = cur - prevScrollY;
      prevScrollY = cur;
      vy += dy * inertiaStrength;                 // inject impulse
      graceUntil = performance.now() + inertiaGraceMs; // extend momentum window
    };

    const tick = () => {
      const now = performance.now();

      if (now >= graceUntil) {
        vy += -y * inertiaSpring;   // spring to 0
        vy *= inertiaFriction;      // friction
      }
      y += vy;                       // integrate

      if (y > inertiaMax) { y = inertiaMax; vy = 0; }
      if (y < -inertiaMax) { y = -inertiaMax; vy = 0; }

      stage.style.setProperty("--inertiaY", `${y.toFixed(2)}px`);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [
    perfOK,
    inertiaEnabled,
    inertiaStrength,
    inertiaFriction,
    inertiaSpring,
    inertiaMax,
    inertiaGraceMs
  ]);

  // Keep bleed as a CSS var for styles
  useEffect(() => {
    setCSSVars({ "--bleed": `${bleedPx}px` });
  }, [bleedPx]);

  const seeds = useMemo(() => makeSeeds(blobCount), [blobCount]);
  const keyframeName = (w) => (w === 0 ? "moveVertical" : w === 1 ? "moveInCircle" : "moveHorizontal");

  return (
    <div
      className="gradient-bg"
      ref={outerRef}
      title={`Press Shift+P to toggle palette (${mode})`}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(40deg, var(--color-bg1), var(--color-bg2))",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      {/* Goo filter */}
      {perfOK && (
        <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="goo" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation={FE_STD} result="blur" />
              <feColorMatrix
                in="blur"
                result="goo"
                type="matrix"
                values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 20 -9" />
              <feBlend in="SourceGraphic" in2="goo" mode="normal" />
            </filter>
          </defs>
        </svg>
      )}

      {/* BLOBS STAGE: bigger than viewport; holds --inertiaY */}
      {perfOK && (
        <div
          ref={stageRef}
          className="gradients-container"
          style={{
            position: "absolute",
            left: 0,
            top: "calc(-1 * var(--bleed, 240px))",
            width: "100%",
            height: "calc(100vh + calc(var(--bleed, 240px) * 2))",
            filter: `url(#goo) blur(${OUTER_BLUR_PX}px)`,
            contain: "paint",
            overflow: "visible",
          }}
        >
          {seeds.map((s, i) => {
            const colorVar = `var(--color${s.colorIndex + 1})`;
            return (
              <div
                key={i}
                className="blob-wrap"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: `translate3d(0, calc(var(--inertiaY) * ${s.pf}), 0)`,
                  willChange: "transform",
                }}
              >
                <div
                  className="blob"
                  style={{
                    background: `radial-gradient(circle at center, rgba(${colorVar}, 0.8) 0, rgba(${colorVar}, 0) 50%) no-repeat`,
                    animation: `${keyframeName(s.which)} ${s.dur}s ${s.ease} infinite`,
                    transformOrigin: `calc(50% + ${s.originX}px) calc(50% + ${s.originY}px)`,
                    top: `calc(50% - var(--circle-size) / 2 + ${s.topOff}px)`,
                    left: `calc(50% - var(--circle-size) / 2 + ${s.leftOff}px)`,
                    width: `var(--circle-size)`,
                    height: `var(--circle-size)`,
                    position: "absolute",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    mixBlendMode: "var(--blending)",
                  }}
                />
              </div>
            );
          })}

          {/* interactive tint that trails the cursor (no halo) */}
          <div
            className="interactive"
            ref={interactiveRef}
            style={{
              background:
                "radial-gradient(circle at center, rgba(var(--color-interactive), 0.8) 0, rgba(var(--color-interactive), 0) 50%) no-repeat",
              opacity: 0.7,
              width: "100%",
              height: "100%",
              top: "-50%",
              left: "-50%",
              position: "absolute",
              willChange: "transform",
              backfaceVisibility: "hidden",
              mixBlendMode: "var(--blending)",
            }}
          />
        </div>
      )}

      {/* CRISP overlay above the blur for the green ring */}
      {perfOK && (
        <div
          className="cursor-overlay"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10,
            filter: "none",
          }}
        >
          <div
            ref={ringRef}
            className="cursor-ring"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${ringSize}px`,
              height: `${ringSize}px`,
              borderRadius: "50%",
              border: "2px solid offwhite",
              background: "transparent",
              boxShadow: "0 0 6px white",
            }}
          />
        </div>
      )}
    </div>
  );
});

export default GradientBG;
