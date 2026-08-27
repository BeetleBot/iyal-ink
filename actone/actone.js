document.addEventListener('DOMContentLoaded', () => {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('actone_theme') || 'lavender';

  function applyTheme(themeName) {
    if (themeName === 'lavender') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
    localStorage.setItem('actone_theme', themeName);

    themeBtns.forEach(btn => {
      if (btn.dataset.setTheme === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (window.updateRainTheme) window.updateRainTheme();
  }

  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.dataset.setTheme;
      applyTheme(targetTheme);
    });
  });

  const canvas = document.getElementById('courierRainCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const COURIER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

    function getRandomGlyph() {
      return COURIER_LETTERS[Math.floor(Math.random() * COURIER_LETTERS.length)];
    }

    const DEPTH_LAYERS = [
      { count: 70, fontSize: 11, speedMin: 0.35, speedMax: 0.75, baseAlpha: 0.16, isAccent: false, trailLength: 2 },
      { count: 55, fontSize: 14, speedMin: 0.75, speedMax: 1.30, baseAlpha: 0.24, isAccent: false, trailLength: 3 },
      { count: 40, fontSize: 18, speedMin: 1.30, speedMax: 1.95, baseAlpha: 0.32, isAccent: false, trailLength: 3 },
      { count: 25, fontSize: 24, speedMin: 1.95, speedMax: 2.80, baseAlpha: 0.44, isAccent: true,  trailLength: 4 },
      { count: 14, fontSize: 32, speedMin: 2.80, speedMax: 3.80, baseAlpha: 0.55, isAccent: true,  trailLength: 4 }
    ];

    let particles = [];

    function initParticles() {
      particles = [];
      DEPTH_LAYERS.forEach((layer, layerIdx) => {
        const scaledCount = Math.floor(layer.count * Math.max(0.7, width / 1100));
        const total = Math.max(10, scaledCount);

        for (let i = 0; i < total; i++) {
          particles.push({
            layer: layerIdx,
            x: Math.random() * width,
            y: Math.random() * (height + 150) - 75,
            speed: layer.speedMin + Math.random() * (layer.speedMax - layer.speedMin),
            fontSize: layer.fontSize,
            baseAlpha: layer.baseAlpha * (0.85 + Math.random() * 0.3),
            char: getRandomGlyph(),
            isAccent: layer.isAccent || (Math.random() < 0.25),
            trailLength: layer.trailLength,
            trail: [],
            morphTimer: Math.random() * 50,
            morphInterval: Math.floor(30 + Math.random() * 70)
          });
        }
      });
    }

    function resizeCanvas() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function getAccentRgb() {
      const style = getComputedStyle(document.documentElement);
      const rgb = style.getPropertyValue('--theme-rgb').trim();
      if (rgb) return rgb;
      return '139, 92, 246';
    }

    let accentRgb = getAccentRgb();
    window.updateRainTheme = () => {
      accentRgb = getAccentRgb();
    };

    let lastTimestamp = 0;

    function renderRain(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min(2.0, (timestamp - lastTimestamp) / 16.666);
      lastTimestamp = timestamp;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.trail.unshift({ y: p.y, char: p.char });
        if (p.trail.length > p.trailLength) {
          p.trail.pop();
        }

        p.y += p.speed * delta;
        p.morphTimer += delta;

        if (p.morphTimer >= p.morphInterval) {
          p.morphTimer = 0;
          p.char = getRandomGlyph();
        }

        let edgeFade = 1.0;
        if (p.y < 50) edgeFade = Math.max(0, p.y / 50);
        else if (p.y > height - 50) edgeFade = Math.max(0, (height - p.y) / 50);

        const currentAlpha = p.baseAlpha * edgeFade;

        ctx.font = `${p.layer >= 3 ? '700 ' : '500 '}${p.fontSize}px 'Courier Prime', 'CourierPrime', Courier, monospace`;

        for (let t = p.trail.length - 1; t >= 0; t--) {
          const ghost = p.trail[t];
          const trailRatio = 1 - ((t + 1) / (p.trail.length + 1));
          const ghostAlpha = currentAlpha * trailRatio * 0.45;

          if (ghostAlpha > 0.02) {
            if (p.isAccent) {
              ctx.fillStyle = `rgba(${accentRgb}, ${ghostAlpha * 0.75})`;
            } else {
              ctx.fillStyle = `rgba(100, 116, 139, ${ghostAlpha * 0.55})`;
            }
            ctx.fillText(ghost.char, p.x, ghost.y);
          }
        }

        if (p.isAccent) {
          ctx.fillStyle = `rgba(${accentRgb}, ${currentAlpha * 0.95})`;
        } else {
          ctx.fillStyle = `rgba(80, 95, 115, ${currentAlpha * 0.75})`;
        }

        ctx.fillText(p.char, p.x, p.y);

        if (p.y > height + 40) {
          p.y = -20 - Math.random() * 40;
          p.x = Math.random() * width;
          p.char = getRandomGlyph();
          p.trail = [];
          p.speed = DEPTH_LAYERS[p.layer].speedMin + Math.random() * (DEPTH_LAYERS[p.layer].speedMax - DEPTH_LAYERS[p.layer].speedMin);
        }
      });

      requestAnimationFrame(renderRain);
    }

    requestAnimationFrame(renderRain);
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'media-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close-btn" id="lightboxClose">Close ✕</button>
      <img id="lightboxImg" src="" alt="Enlarged screenshot">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Preview';
      lightbox.classList.add('is-active');
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    if (lightboxImg) lightboxImg.src = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });

  document.querySelectorAll('.feature-media-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const img = frame.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });
});
