import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/motion';
import './FloatingPetals.scss';

/**
 * Lightweight canvas petal fall (replaces the `fall` npm package, which is an
 * unrelated control-flow library). Petal sprites are pre-rendered once; each
 * particle varies in size, speed, sway, spin, 3D flip and opacity. Pauses
 * when off-screen or when the tab is hidden.
 */

const PALETTES = {
  wedding: [
    ['#fbe0dc', '#e9a3aa'], // blush rose petal
    ['#f6c7c9', '#c9707e'], // deeper rose
    ['#ffd27a', '#e8891e'], // marigold
    ['#fff4c7', '#f0b43a'], // yellow marigold
    ['#ffffff', '#efe3c9'], // jasmine
    ['#fde3cf', '#f0a987'], // peach
    ['leaf', '#8fab7b'], // mango / autumn leaf
  ],
};

function makeSprite([light, deep]) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (light === 'leaf') {
    const grad = g.createLinearGradient(32, 4, 32, 60);
    grad.addColorStop(0, '#c2d3a8');
    grad.addColorStop(1, deep);
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(32, 3);
    g.bezierCurveTo(46, 16, 44, 44, 32, 61);
    g.bezierCurveTo(20, 44, 18, 16, 32, 3);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.45)';
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(32, 8);
    g.lineTo(32, 56);
    g.stroke();
    return c;
  }
  const grad = g.createLinearGradient(32, 6, 32, 58);
  grad.addColorStop(0, light);
  grad.addColorStop(1, deep);
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(32, 58);
  g.bezierCurveTo(10, 46, 10, 14, 26, 7);
  g.quadraticCurveTo(32, 12, 38, 7);
  g.bezierCurveTo(54, 14, 54, 46, 32, 58);
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(32, 54);
  g.quadraticCurveTo(30, 34, 32, 14);
  g.stroke();
  return c;
}

const rand = (a, b) => a + Math.random() * (b - a);

export default function FloatingPetals({ active = true, density = 1, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const sprites = PALETTES.wedding.map(makeSprite);
    let w = 0;
    let h = 0;
    let particles = [];
    let raf = 0;
    let last = 0;
    let visible = true;

    const spawn = (p, initial) => {
      p.size = rand(9, 20);
      p.x = rand(-20, w + 20);
      p.baseX = p.x;
      p.y = initial ? rand(-h * 1.1, -20) : rand(-60, -20);
      p.vy = rand(16, 38) * (p.size / 15);
      p.amp = rand(12, 42);
      p.freq = rand(0.25, 0.7);
      p.phase = rand(0, Math.PI * 2);
      p.rot = rand(0, Math.PI * 2);
      p.vrot = rand(-1.1, 1.1);
      p.flip = rand(0.8, 2.2);
      p.alpha = rand(0.55, 0.92);
      p.drift = rand(-8, 10);
      const leaf = Math.random() < 0.14;
      p.sprite = leaf ? sprites[6] : sprites[Math.floor(Math.random() * 6)];
      if (leaf) p.size *= 1.25;
      return p;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(30, Math.max(12, (w * h) / 21000)) * density);
      while (particles.length < target) particles.push(spawn({}, true));
      particles.length = target;
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy * dt;
        p.baseX += p.drift * dt;
        p.x = p.baseX + Math.sin(t * p.freq + p.phase) * p.amp;
        p.rot += p.vrot * dt;
        if (p.y > h + 30) spawn(p, false);
        const flip = Math.cos(t * p.flip + p.phase);
        ctx.save();
        ctx.globalAlpha = p.alpha * (0.75 + 0.25 * Math.abs(flip));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(0.35 + 0.65 * Math.abs(flip), 1);
        ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      last = 0;
    });
    io.observe(canvas);
    const onVis = () => {
      visible = !document.hidden;
      last = 0;
    };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      ctx.clearRect(0, 0, w, h);
    };
  }, [active, density]);

  return <canvas ref={canvasRef} className={`floating-petals ${className}`} aria-hidden="true" />;
}
