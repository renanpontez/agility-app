'use client';

import { useEffect, useRef } from 'react';

/**
 * Deep-space starfield rendered on a single canvas.
 *
 * Stars fade in at random positions, drift in a straight line with a gentle
 * downward "gravity", then fade out and respawn somewhere else — a slow,
 * living sky. Every so often (rare, randomly timed) a shooting star streaks
 * across at 45° with a bright head and a fading violet-white trail.
 *
 * Honors prefers-reduced-motion by painting a single static field with no
 * drift, twinkle, or shooting stars.
 */

type Star = {
  x: number;
  y: number;
  r: number;
  vx: number; // px per ms
  vy: number;
  life: number; // ms elapsed
  maxLife: number;
  fadeIn: number;
  fadeOut: number;
  baseAlpha: number;
  tint: string; // "r, g, b"
};

type Shooter = {
  x: number;
  y: number;
  vx: number; // px per ms
  vy: number;
  len: number;
  life: number;
  maxLife: number;
};

const Starfield = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    const shooters: Shooter[] = [];
    let raf = 0;
    let last = 0;
    let nextShoot = 0;

    const makeStar = (randomPhase: boolean): Star => {
      const maxLife = rand(3800, 11000);
      const violet = Math.random() < 0.1;
      return {
        x: rand(0, width),
        y: rand(0, height),
        r: rand(0.35, 1.5),
        vx: rand(-9, 9) / 1000,
        vy: rand(1, 11) / 1000, // gentle, mostly-downward drift
        maxLife,
        life: randomPhase ? rand(0, maxLife) : 0,
        fadeIn: rand(600, 1500),
        fadeOut: rand(800, 1900),
        baseAlpha: rand(0.45, 1),
        tint: violet ? '198, 150, 255' : '255, 255, 255',
      };
    };

    const alphaOf = (s: Star) => {
      if (s.life < s.fadeIn) {
        return (s.life / s.fadeIn) * s.baseAlpha;
      }
      if (s.life > s.maxLife - s.fadeOut) {
        return Math.max(0, (s.maxLife - s.life) / s.fadeOut) * s.baseAlpha;
      }
      return s.baseAlpha;
    };

    const paintStar = (s: Star, a: number) => {
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${s.tint})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1) {
        ctx.globalAlpha = a * 0.22;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        paintStar(s, s.baseAlpha * 0.85);
      }
      ctx.globalAlpha = 1;
    };

    const spawnShooter = () => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed = rand(0.85, 1.35); // px per ms — fast
      const startX = dir === 1 ? rand(-0.1 * width, 0.55 * width) : rand(0.45 * width, 1.1 * width);
      shooters.push({
        x: startX,
        y: rand(-0.05 * height, 0.28 * height),
        vx: dir * speed * Math.SQRT1_2,
        vy: speed * Math.SQRT1_2,
        len: rand(120, 210),
        life: 0,
        maxLife: rand(650, 1050),
      });
    };

    const drawShooter = (sh: Shooter) => {
      const mag = Math.hypot(sh.vx, sh.vy) || 1;
      const ux = sh.vx / mag;
      const uy = sh.vy / mag;
      const tailX = sh.x - ux * sh.len;
      const tailY = sh.y - uy * sh.len;
      const p = sh.life / sh.maxLife;
      const a = p < 0.18 ? p / 0.18 : Math.max(0, 1 - (p - 0.18) / 0.82);

      const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${a})`);
      grad.addColorStop(0.4, `rgba(210, 180, 255, ${a * 0.45})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      ctx.arc(sh.x, sh.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(40, Math.min(230, Math.round((width * height) / 6800)));
      stars = Array.from({ length: count }, () => makeStar(true));
      if (reduce) {
        drawStatic();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 60);
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        s.life += dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.life >= s.maxLife || s.x < -6 || s.x > width + 6 || s.y < -6 || s.y > height + 6) {
          Object.assign(s, makeStar(false));
        }
        const a = alphaOf(s);
        if (a > 0.01) {
          paintStar(s, a);
        }
      }
      ctx.globalAlpha = 1;

      if (now >= nextShoot) {
        // At most one streak at a time; keeps them genuinely rare even after
        // the tab returns from the background (rAF resumes with a stale clock).
        if (shooters.length === 0) {
          spawnShooter();
        }
        nextShoot = now + rand(16000, 40000); // really rare
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i]!;
        sh.life += dt;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        if (sh.life >= sh.maxLife || sh.x < -260 || sh.x > width + 260 || sh.y > height + 260) {
          shooters.splice(i, 1);
          continue;
        }
        drawShooter(sh);
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);

    if (!reduce) {
      last = performance.now();
      nextShoot = last + rand(5000, 11000);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block size-full"
    />
  );
};

export default Starfield;
