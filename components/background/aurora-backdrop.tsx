"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  cyan: boolean;
};

const MAX_PARTICLES = 56;
const LINK_DISTANCE = 130;

export function AuroraBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const host = canvas;
    const ctx = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrame = 0;
    let rafPending = false;

    function resize() {
      const deviceRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      host.width = Math.floor(width * deviceRatio);
      host.height = Math.floor(height * deviceRatio);
      host.style.width = `${width}px`;
      host.style.height = `${height}px`;
      ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
      seed();
    }

    function seed() {
      const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.4 + 0.6,
        cyan: Math.random() > 0.8,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.cyan
          ? "rgba(34, 211, 238, 0.5)"
          : "rgba(148, 163, 184, 0.28)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < LINK_DISTANCE) {
            const opacity = (1 - distance / LINK_DISTANCE) * 0.16;
            const cyanPair = particle.cyan || other.cyan;
            ctx.strokeStyle = cyanPair
              ? `rgba(34, 211, 238, ${opacity})`
              : `rgba(148, 163, 184, ${opacity * 0.7})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }
    }

    function tick() {
      rafPending = false;
      draw();
      if (!reduced) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    }

    function schedule() {
      if (!rafPending) {
        rafPending = true;
        animationFrame = window.requestAnimationFrame(tick);
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        schedule();
      }
    }

    resize();
    if (reduced) {
      draw();
    } else {
      schedule();
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}