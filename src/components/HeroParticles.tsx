"use client";

import { useEffect, useRef } from "react";

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
<<<<<<< HEAD
=======

>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

<<<<<<< HEAD
    // ── Particle system with connection lines (constellation effect) ──
    const count = 90;
    const colorBases = [
      "rgba(217, 119, 6, ",
      "rgba(245, 158, 11, ",
      "rgba(16, 185, 129, ",
    ];

    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: (Math.random() - 0.5) * 0.45,
      opacity: Math.random() * 0.5 + 0.15,
      colorBase: colorBases[Math.floor(Math.random() * colorBases.length)],
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    // Floating hexagons & crystal unit cells (materials engineering theme)
    const hexagons = Array.from({ length: 9 }).map((_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 28 + 18,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.08 + 0.03,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      isLattice: idx % 2 === 0,
    }));

    const drawHex = (x: number, y: number, size: number, angle: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = angle + (i * Math.PI) / 3;
        const px = x + size * Math.cos(a);
        const py = y + size * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw hexagons
      hexagons.forEach((h) => {
        h.x += h.speedX;
        h.y += h.speedY;
        h.rotation += h.rotSpeed;
        if (h.x < -60) h.x = width + 60;
        if (h.x > width + 60) h.x = -60;
        if (h.y < -60) h.y = height + 60;
        if (h.y > height + 60) h.y = -60;

        ctx.save();
        drawHex(h.x, h.y, h.size, h.rotation);
        ctx.strokeStyle = `rgba(217, 119, 6, ${h.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (h.isLattice) {
          // Inner atom nodes at vertices
          for (let i = 0; i < 6; i++) {
            const a = h.rotation + (i * Math.PI) / 3;
            const px = h.x + h.size * Math.cos(a);
            const py = h.y + h.size * Math.sin(a);
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 158, 11, ${h.opacity * 2.5})`;
            ctx.fill();
          }
          // Center atom
          ctx.beginPath();
          ctx.arc(h.x, h.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${h.opacity * 3})`;
          ctx.fill();
        }

        ctx.restore();
      });

      // Draw connection lines between close particles
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles with pulsing
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulsePhase += p.pulseSpeed;
=======
    // Generate 60 floating particles in brand Golden and Orange shades
    const particleCount = 60;
    const colorBases = ["rgba(217, 119, 6, ", "rgba(245, 158, 11, "];
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
      colorBase: colorBases[Math.floor(Math.random() * colorBases.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

<<<<<<< HEAD
        const pulsedRadius = p.radius + Math.sin(p.pulsePhase) * 0.5;
        const pulsedOpacity = p.opacity + Math.sin(p.pulsePhase) * 0.08;

        // Outer glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedRadius * 3);
        grd.addColorStop(0, `${p.colorBase}${pulsedOpacity})`);
        grd.addColorStop(1, `${p.colorBase}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${pulsedOpacity})`;
        ctx.fill();
      });

      // Occasional shooting star
      if (frame % 300 === 0) {
        const sx = Math.random() * width;
        const sy = Math.random() * (height * 0.4);
        ctx.save();
        const grad = ctx.createLinearGradient(sx, sy, sx + 120, sy + 20);
        grad.addColorStop(0, "rgba(245, 158, 11, 0)");
        grad.addColorStop(0.5, "rgba(245, 158, 11, 0.6)");
        grad.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 120, sy + 20);
        ctx.stroke();
        ctx.restore();
      }

=======
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${p.opacity})`;
        ctx.fill();
      });

>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
<<<<<<< HEAD
      className="fixed inset-0 pointer-events-none z-0"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.65 }}
=======
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
>>>>>>> 09b2a302a6578eb70d80e94949a12c8b9ce02098
    />
  );
}
