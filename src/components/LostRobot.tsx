"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useRef } from "react";
import { useTier } from "@/motion/MotionProvider";
import { tierAtLeast } from "@/motion/device-tier";

/**
 * The 404 mascot: a small robot from the IT Shaharcha skyline, lost and reading
 * a map next to a "404" signpost. It bobs, blinks, the sign sways, and on
 * capable devices its eyes follow the cursor.
 */
export function LostRobot({ label }: { label: string }) {
  const tier = useTier();
  const ref = useRef<SVGSVGElement>(null);
  const lookX = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const lookY = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const pupilX = useTransform(lookX, (v) => v * 5);
  const pupilY = useTransform(lookY, (v) => v * 4);
  const headTilt = useTransform(lookX, (v) => v * 6);
  const live = tierAtLeast(tier, "mid");

  useEffect(() => {
    if (tier !== "high") return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      lookX.set(Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width * 0.45)) / (r.width * 0.6))));
      lookY.set(Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.35)) / (r.height * 0.6))));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [tier, lookX, lookY]);

  const bob = live ? { y: [0, -10, 0] } : undefined;

  return (
    <svg ref={ref} viewBox="0 0 520 480" role="img" aria-label={label} className="h-auto w-full max-w-[520px]">
      <defs>
        <radialGradient id="nf-glow">
          <stop offset="0%" stopColor="#5b4bdb" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5b4bdb" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow and ground */}
      <circle cx="270" cy="250" r="230" fill="url(#nf-glow)" />
      <ellipse cx="270" cy="438" rx="200" ry="22" fill="#121a45" />

      {/* Little footprints wandering off */}
      <g fill="#22c7d6" opacity="0.35">
        {[
          [120, 440],
          [150, 452],
          [180, 440],
          [210, 452],
        ].map(([x, y], i) => (
          <m.ellipse
            key={i}
            cx={x}
            cy={y}
            rx="9"
            ry="5"
            animate={live ? { opacity: [0.2, 1, 0.2] } : undefined}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </g>

      {/* Signpost */}
      <m.g
        style={{ transformOrigin: "95px 440px" }}
        animate={live ? { rotate: [-3, 3, -3] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="88" y="250" width="14" height="190" rx="4" fill="#8a5a2b" />
        <path d="M30 262h122l20 26-20 26H30z" fill="#ffc15e" />
        <text x="92" y="302" textAnchor="middle" fontSize="38" fontWeight="800" fill="#0a0f2c" className="font-display">
          404
        </text>
        <path d="M48 330h90l-16 20 16 20H48z" fill="#22c7d6" opacity="0.85" />
      </m.g>

      {/* Robot */}
      <m.g animate={bob} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        {/* legs */}
        <rect x="236" y="360" width="22" height="60" rx="10" fill="#2a2f8f" />
        <rect x="292" y="360" width="22" height="60" rx="10" fill="#2a2f8f" />
        <rect x="226" y="410" width="42" height="18" rx="9" fill="#1b2562" />
        <rect x="282" y="410" width="42" height="18" rx="9" fill="#1b2562" />

        {/* body */}
        <rect x="206" y="236" width="138" height="136" rx="34" fill="#5b4bdb" />
        <rect x="232" y="266" width="86" height="54" rx="14" fill="#0a0f2c" />
        {[0, 1, 2].map((i) => (
          <m.rect
            key={i}
            x={246 + i * 22}
            y="286"
            width="14"
            height="14"
            rx="3"
            fill="#ffc15e"
            animate={live ? { opacity: [1, 0.25, 1] } : undefined}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
          />
        ))}

        {/* head */}
        <m.g style={{ rotate: headTilt, transformOrigin: "275px 228px" }}>
          <rect x="272" y="96" width="6" height="34" rx="3" fill="#8f86ff" />
          <m.circle
            cx="275"
            cy="92"
            r="10"
            fill="#22c7d6"
            animate={live ? { opacity: [1, 0.35, 1], scale: [1, 1.25, 1] } : undefined}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{ transformOrigin: "275px 92px" }}
          />
          <rect x="196" y="126" width="158" height="112" rx="40" fill="#8f86ff" />
          <rect x="214" y="146" width="122" height="70" rx="28" fill="#0a0f2c" />
          {/* eyes */}
          <m.g
            animate={live ? { scaleY: [1, 1, 0.1, 1, 1] } : undefined}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
            style={{ transformOrigin: "275px 180px" }}
          >
            <circle cx="250" cy="180" r="15" fill="#eef2fa" />
            <circle cx="300" cy="180" r="15" fill="#eef2fa" />
            <m.circle cx="250" cy="180" r="7" fill="#0a0f2c" style={{ x: pupilX, y: pupilY }} />
            <m.circle cx="300" cy="180" r="7" fill="#0a0f2c" style={{ x: pupilX, y: pupilY }} />
          </m.g>
          {/* puzzled mouth */}
          <path d="M262 206q13 -7 26 0" stroke="#ffc15e" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* cheeks */}
          <circle cx="224" cy="200" r="7" fill="#ff8a9a" opacity="0.7" />
          <circle cx="326" cy="200" r="7" fill="#ff8a9a" opacity="0.7" />
        </m.g>

        {/* map held in both hands */}
        <m.g
          style={{ transformOrigin: "275px 330px" }}
          animate={live ? { rotate: [-2, 2, -2] } : undefined}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M196 300l54 -12 50 12 54 -12v76l-54 12 -50 -12 -54 12z" fill="#eef2fa" />
          <path d="M250 288v76M300 300v76" stroke="#0a0f2c" strokeOpacity="0.15" strokeWidth="2" />
          <path d="M214 346q28 -30 52 -6t58 -16" stroke="#ff8a9a" strokeWidth="3" strokeDasharray="6 6" fill="none" />
          <path d="M318 318l10 10m0 -10l-10 10" stroke="#ff8a9a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="190" cy="334" r="13" fill="#8f86ff" />
          <circle cx="360" cy="322" r="13" fill="#8f86ff" />
        </m.g>
      </m.g>

      {/* Floating question marks */}
      {[
        { x: 382, y: 118, d: 0 },
        { x: 418, y: 170, d: 0.8 },
        { x: 150, y: 150, d: 1.6 },
      ].map((q, i) => (
        <m.text
          key={i}
          x={q.x}
          y={q.y}
          fontSize={i === 1 ? 26 : 36}
          fontWeight="800"
          fill={i === 2 ? "#22c7d6" : "#ffc15e"}
          className="font-display"
          animate={live ? { y: [q.y, q.y - 14, q.y], opacity: [0.4, 1, 0.4] } : undefined}
          transition={{ duration: 3, repeat: Infinity, delay: q.d, ease: "easeInOut" }}
        >
          ?
        </m.text>
      ))}
    </svg>
  );
}
