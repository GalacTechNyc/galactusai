// Starfield + Cursor Stardust — May 2025 v1.4
// Retina‑sharp, parallax depth, twinkling stars, smoother trail.

const DPR = window.devicePixelRatio || 1;

// ----- Canvas setup -----
const canvas = document.createElement('canvas');
Object.assign(canvas.style, {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  pointerEvents: 'none'
});
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth  * DPR;
  canvas.height = window.innerHeight * DPR;
  ctx.scale(DPR, DPR);
}
window.addEventListener('resize', resize);
resize();

// ----- Star factory -----
const STAR_COUNT = 160;
const stars = Array.from({ length: STAR_COUNT }, createStar);

function createStar() {
  const depth = Math.random() * 1.5 + 0.3;      // 0.3 – 1.8
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    depth,
    baseSize: depth * 1.2,
    speedX: -depth * 0.6,
    speedY: depth * 0.2,
    twinkleOffset: Math.random() * Math.PI * 2
  };
}

// ----- Cursor stardust trail -----
const trail = [];
const MAX_TRAIL = 120;

window.addEventListener('pointermove', (e) => {
  for (let i = 0; i < 6; i++) {                 // sprinkle 6 sparkles
    if (trail.length > MAX_TRAIL) trail.shift();
    trail.push({
      x: e.clientX + (Math.random() - 0.5) * 10,
      y: e.clientY + (Math.random() - 0.5) * 10,
      size: Math.random() * 3 + 1,
      alpha: 1,
      decay: Math.random() * 0.03 + 0.015
    });
  }
});

// ----- Animation loop -----
let last = performance.now();
function loop(now = performance.now()) {
  const dt = (now - last) / 16.67; // normalize to ~60 fps frames
  last = now;

  ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);

  // — Stars —
  stars.forEach((s) => {
    s.x += s.speedX * dt;
    s.y += s.speedY * dt;

    // recycle off‑screen stars
    if (s.x < -50 || s.y > window.innerHeight + 50) {
      Object.assign(s, createStar(), { x: window.innerWidth + 50 });
    }

    const twinkle = (Math.sin(now / 1000 + s.twinkleOffset) + 1) * 0.5; // 0‑1
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.baseSize * (0.7 + twinkle * 0.3), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.6 + twinkle * 0.4})`;
    ctx.fill();
  });

  // — Trail —
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${t.alpha})`;
    ctx.fill();

    t.alpha -= t.decay * dt;
    t.size *= 0.98;

    if (t.alpha <= 0.01) {
      trail.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
