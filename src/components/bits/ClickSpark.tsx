'use client';
// Source: React Bits (reactbits.dev, MIT + Commons Clause), ClickSpark-TS-TW.
// edu: rewritten for performance. The original sizes a canvas to the whole page and
// runs requestAnimationFrame forever. This version uses one viewport-sized fixed canvas,
// listens on window, and only animates while sparks are alive.
import { useEffect, useRef } from 'react';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  enabled?: boolean;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export default function ClickSpark({
  sparkColor = '#ffc15e',
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
  enabled = true
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!enabled || !canvas || !ctx) return;

    const sparks: Spark[] = [];
    let frame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const p = (now - s.startTime) / duration;
        if (p >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        const eased = p * (2 - p);
        const dist = eased * sparkRadius;
        const len = sparkSize * (1 - eased);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x + dist * Math.cos(s.angle), s.y + dist * Math.sin(s.angle));
        ctx.lineTo(s.x + (dist + len) * Math.cos(s.angle), s.y + (dist + len) * Math.sin(s.angle));
        ctx.stroke();
      }
      frame = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / sparkCount, startTime: now });
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] h-screen w-screen"
    />
  );
}
