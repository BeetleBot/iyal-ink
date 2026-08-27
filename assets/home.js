/**
 * iyal.ink — Background Particle Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('homeRainCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

  function getRandomGlyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  const LAYERS = [
    { count: 40, fontSize: 11, speedMin: 0.3, speedMax: 0.7, baseAlpha: 0.15 },
    { count: 30, fontSize: 14, speedMin: 0.7, speedMax: 1.2, baseAlpha: 0.25 },
    { count: 20, fontSize: 18, speedMin: 1.2, speedMax: 1.8, baseAlpha: 0.38 },
    { count: 10, fontSize: 24, speedMin: 1.8, speedMax: 2.6, baseAlpha: 0.52 }
  ];

  let particles = [];

  function initParticles() {
    particles = [];
    LAYERS.forEach((layer, layerIdx) => {
      const total = Math.floor(layer.count * Math.max(0.6, width / 1200));
      for (let i = 0; i < total; i++) {
        particles.push({
          layer: layerIdx,
          x: Math.random() * width,
          y: Math.random() * (height + 100) - 50,
          speed: layer.speedMin + Math.random() * (layer.speedMax - layer.speedMin),
          fontSize: layer.fontSize,
          baseAlpha: layer.baseAlpha * (0.8 + Math.random() * 0.4),
          char: getRandomGlyph(),
          isAccent: Math.random() < 0.2,
          morphTimer: Math.random() * 60,
          morphInterval: Math.floor(40 + Math.random() * 80)
        });
      }
    });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initParticles();
  }

  window.addEventListener('resize', resize);
  resize();

  let lastTime = 0;

  function render(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = Math.min(2.0, (timestamp - lastTime) / 16.666);
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speed * delta;
      p.morphTimer += delta;

      if (p.morphTimer >= p.morphInterval) {
        p.morphTimer = 0;
        p.char = getRandomGlyph();
      }

      ctx.font = `${p.layer >= 2 ? '700 ' : '400 '}${p.fontSize}px 'CourierPrime', Courier, monospace`;

      if (p.isAccent) {
        ctx.fillStyle = `rgba(52, 211, 153, ${p.baseAlpha * 0.8})`;
      } else {
        ctx.fillStyle = `rgba(160, 175, 195, ${p.baseAlpha * 0.6})`;
      }

      ctx.fillText(p.char, p.x, p.y);

      if (p.y > height + 30) {
        p.y = -20;
        p.x = Math.random() * width;
        p.char = getRandomGlyph();
      }
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});
