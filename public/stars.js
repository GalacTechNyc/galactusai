const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '1';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function createStar() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 2 + 0.5
  };
}

let trail = [];

window.addEventListener('mousemove', (e) => {
  trail.push({
    x: e.clientX,
    y: e.clientY,
    size: Math.random() * 2 + 1,
    alpha: 1.0
  });
});

function drawTrail() {
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${t.alpha})`;
    ctx.fill();
    t.alpha -= 0.02;
    if (t.alpha <= 0) {
      trail.splice(i, 1);
      i--;
    }
  }
}

function animateStarsAndTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star, index) => {
    star.x -= star.speed;
    star.y += star.speed * 0.3;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    if (star.x < 0 || star.y > canvas.height) {
      stars[index] = createStar();
    }
  });

  drawTrail();
  requestAnimationFrame(animateStarsAndTrail);
}

for (let i = 0; i < 100; i++) {
  stars.push(createStar());
}
// Replace old animation call
animateStarsAndTrail();
