"use client";

import { useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { Category } from "@/lib/types";
import { tierAtLeast } from "@/motion/device-tier";
import { useTier } from "@/motion/MotionProvider";

/** Fired when a building is picked; the Courses section listens and applies the filter. */
export const PICK_DIRECTION_EVENT = "edu:pick-direction";

/** Seeded PRNG so server and client draw identical windows (no hydration mismatch). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface Building {
  dir: Category;
  x: number;
  w: number;
  h: number;
  fill: string;
  roof?: "antenna" | "dome" | "flat";
}

const W = 600;
const H = 520;
const GROUND = 470;

const BUILDINGS: Building[] = [
  { dir: "office", x: 28, w: 108, h: 210, fill: "#1b2562", roof: "flat" },
  { dir: "programming", x: 150, w: 132, h: 380, fill: "#2a2f8f", roof: "antenna" },
  { dir: "design", x: 296, w: 118, h: 300, fill: "#1b2562", roof: "dome" },
  { dir: "marketing", x: 428, w: 126, h: 250, fill: "#2a2f8f", roof: "flat" },
];

const BACKDROP = [
  { x: 0, w: 70, h: 150 },
  { x: 92, w: 60, h: 250 },
  { x: 250, w: 80, h: 200 },
  { x: 380, w: 64, h: 330 },
  { x: 520, w: 80, h: 190 },
];

type Win = { x: number; y: number; o: number; d: number; tw: boolean; twDur: number; twDelay: number };

function windowsFor(b: Building, seed: number): Win[] {
  const r = rng(seed);
  const out: Win[] = [];
  const cols = Math.floor((b.w - 24) / 22);
  const rows = Math.floor((b.h - 40) / 26);
  const padX = (b.w - cols * 22 + 8) / 2;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = r() > 0.38;
      if (!lit) continue;
      out.push({
        x: b.x + padX + col * 22,
        y: GROUND - b.h + 28 + row * 26,
        o: 0.55 + r() * 0.45,
        // Lights come on bottom-up, like evening falling on the city
        d: 0.3 + (rows - row) * 0.07 + r() * 0.25,
        tw: r() > 0.82,
        twDur: 4 + r() * 6,
        twDelay: 2 + r() * 6,
      });
    }
  }
  return out;
}

const WINDOWS = BUILDINGS.map((b, i) => windowsFor(b, 7 + i * 31));

const STARS = (() => {
  const r = rng(99);
  return Array.from({ length: 38 }, () => ({ x: r() * W, y: r() * 200, s: 0.6 + r() * 1.3, o: 0.25 + r() * 0.6 }));
})();

export function CityScene() {
  const t = useTranslations("Hero");
  const td = useTranslations("Directions");
  const tier = useTier();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Category | null>(null);

  // Pointer parallax (high tier, mouse only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const farX = useTransform(sx, (v) => v * -10);
  const farY = useTransform(sy, (v) => v * -6);
  const nearX = useTransform(sx, (v) => v * 14);
  const nearY = useTransform(sy, (v) => v * 6);
  const starX = useTransform(sx, (v) => v * -22);

  // Scroll parallax (mid and up): the city sinks slightly as you scroll away
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sink = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  const scrollOn = tierAtLeast(tier, "mid");

  function onPointerMove(e: React.PointerEvent) {
    if (tier !== "high" || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function pick(dir: Category) {
    window.dispatchEvent(new CustomEvent(PICK_DIRECTION_EVENT, { detail: dir }));
    document.getElementById("courses")?.scrollIntoView({
      behavior: tier === "none" ? "auto" : "smooth",
    });
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="rise relative mx-auto w-full max-w-[640px]"
      style={{ "--d": "0.1s" } as React.CSSProperties}
    >
      <m.div style={scrollOn ? { y: sink } : undefined}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="group"
          aria-label={t("cityLabel")}
          className="h-auto w-full overflow-visible"
        >
          <defs>
            <radialGradient id="moon-glow">
              <stop offset="0%" stopColor="#ffc15e" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffc15e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22c7d6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22c7d6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="beam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffc15e" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffc15e" stopOpacity="0" />
            </linearGradient>
          </defs>

          <m.g style={{ x: starX }}>
            {STARS.map((s, i) => (
              <circle
                key={i}
                className="win tw"
                cx={s.x}
                cy={s.y}
                r={s.s}
                fill="#eef2fa"
                style={
                  {
                    "--o": s.o,
                    "--d": `${0.2 + i * 0.02}s`,
                    "--tw": `${3 + (i % 5)}s`,
                    "--dt": `${(i % 7) * 0.7}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </m.g>

          <m.g style={scrollOn ? { y: moonY } : undefined}>
            <circle cx="500" cy="80" r="90" fill="url(#moon-glow)" />
            <circle cx="500" cy="80" r="30" fill="#ffc15e" />
            <circle cx="512" cy="72" r="26" fill="#121a45" opacity="0.9" />
          </m.g>

          <m.g style={{ x: farX, y: farY }} opacity="0.5">
            {BACKDROP.map((b) => (
              <rect key={b.x} x={b.x} y={GROUND - b.h} width={b.w} height={b.h} rx="4" fill="#141d52" />
            ))}
          </m.g>

          <m.g style={{ x: nearX, y: nearY }}>
            {BUILDINGS.map((b, i) => {
              const isActive = active === b.dir;
              const dim = active !== null && !isActive;
              const top = GROUND - b.h;
              const label = td(b.dir);
              return (
                <g
                  key={b.dir}
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  onClick={() => pick(b.dir)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pick(b.dir);
                    }
                  }}
                  onPointerEnter={() => setActive(b.dir)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(b.dir)}
                  onBlur={() => setActive(null)}
                  className="cursor-pointer outline-none"
                  style={{
                    opacity: dim ? 0.55 : 1,
                    transition: "opacity 300ms, transform 400ms cubic-bezier(.2,.8,.2,1)",
                    transform: isActive && tier !== "none" ? "translateY(-8px)" : "none",
                    transformBox: "fill-box",
                  }}
                >
                  {isActive && (
                    <rect
                      x={b.x - 6}
                      y={0}
                      width={b.w + 12}
                      height={top}
                      fill="url(#beam)"
                      opacity="0.6"
                    />
                  )}
                  <rect
                    x={b.x}
                    y={top}
                    width={b.w}
                    height={b.h}
                    rx="6"
                    fill={b.fill}
                    stroke={isActive ? "#ffc15e" : "rgba(238,242,250,0.08)"}
                    strokeWidth={isActive ? 2 : 1}
                  />
                  {b.roof === "antenna" && (
                    <>
                      <rect x={b.x + b.w / 2 - 1.5} y={top - 46} width="3" height="46" fill="#5b4bdb" />
                      <circle
                        className="ring"
                        cx={b.x + b.w / 2}
                        cy={top - 48}
                        r="6"
                        fill="none"
                        stroke="#22c7d6"
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                      <circle cx={b.x + b.w / 2} cy={top - 48} r="4" fill="#22c7d6" />
                    </>
                  )}
                  {b.roof === "dome" && (
                    <path
                      d={`M${b.x + 14} ${top} a${b.w / 2 - 14} ${b.w / 2 - 14} 0 0 1 ${b.w - 28} 0z`}
                      fill="#5b4bdb"
                    />
                  )}
                  {WINDOWS[i].map((w, k) => (
                    <rect
                      key={k}
                      className={w.tw ? "win tw" : "win"}
                      x={w.x}
                      y={w.y}
                      width="14"
                      height="14"
                      rx="2"
                      fill={isActive ? "#ffe3a8" : "#ffc15e"}
                      style={
                        {
                          "--o": isActive ? 1 : w.o,
                          "--d": `${w.d}s`,
                          "--tw": `${w.twDur}s`,
                          "--dt": `${w.twDelay}s`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                  <text
                    x={b.x + b.w / 2}
                    y={GROUND + 30}
                    textAnchor="middle"
                    className="font-display"
                    // Shrink long labels (e.g. ru "Программирование") to the building width
                    fontSize={Math.min(15, (b.w + 12) / (label.length * 0.74))}
                    fontWeight="700"
                    fill={isActive ? "#ffc15e" : "rgba(238,242,250,0.7)"}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </m.g>

          <rect x="0" y={GROUND} width={W} height="4" rx="2" fill="#22c7d6" opacity="0.7" />
          <rect x="0" y={GROUND + 4} width={W} height="60" fill="url(#ground)" />
        </svg>
      </m.div>
      <p className="mt-2 text-center text-sm text-chalk/55">{t("cityHint")}</p>
    </div>
  );
}
