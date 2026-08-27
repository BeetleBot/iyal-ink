/**
 * Fount TUI — Interactive Engine
 * Aspen Search × Terminal Aesthetic Fusion
 * Multi-Depth Raining Courier Prime Letters Canvas Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.removeAttribute('data-theme');
  try { localStorage.removeItem('fount_theme'); } catch(e) {}

  // 2. Real-Time Header Clock
  function updateClocks() {
    const now = new Date();
    const headerTimeEl = document.getElementById('header-live-time');
    if (headerTimeEl) {
      headerTimeEl.textContent = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
    }
  }

  setInterval(updateClocks, 1000);
  updateClocks();

  // 3. Quick Copy Command
  const copyBtn = document.getElementById('copyInstallCmd');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = 'cargo install fount';
      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'COPIED ✓';
        copyBtn.style.color = 'var(--accent)';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }

  // 4. Subtle, Multi-Depth Individual Falling Courier Prime Letters Engine
  const canvas = document.getElementById('courierRainCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const COURIER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

    function getRandomGlyph() {
      return COURIER_LETTERS[Math.floor(Math.random() * COURIER_LETTERS.length)];
    }

    // 5 Deep, Immersive Layers with Darkened, Clearly Visible Typography
    const DEPTH_LAYERS = [
      { count: 90, fontSize: 10, speedMin: 0.40, speedMax: 0.85, baseAlpha: 0.22, isAccent: false, trailLength: 2 }, // Deepest horizon
      { count: 75, fontSize: 13, speedMin: 0.85, speedMax: 1.45, baseAlpha: 0.35, isAccent: false, trailLength: 3 }, // Deep midground
      { count: 55, fontSize: 17, speedMin: 1.45, speedMax: 2.20, baseAlpha: 0.48, isAccent: false, trailLength: 3 }, // True midground
      { count: 35, fontSize: 23, speedMin: 2.20, speedMax: 3.20, baseAlpha: 0.62, isAccent: true,  trailLength: 4 }, // Foreground
      { count: 18, fontSize: 30, speedMin: 3.20, speedMax: 4.40, baseAlpha: 0.75, isAccent: true,  trailLength: 4 }  // Near focus
    ];

    let particles = [];

    function initParticles() {
      particles = [];
      DEPTH_LAYERS.forEach((layer, layerIdx) => {
        const scaledCount = Math.floor(layer.count * Math.max(0.7, width / 1100));
        const total = Math.max(14, scaledCount);

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
      const hex = style.getPropertyValue('--accent').trim() || '#34d399';
      if (hex.startsWith('#')) {
        let c = hex.substring(1);
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
      }
      return '52, 211, 153';
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
        // Track recent positions for trailing effect
        p.trail.unshift({ y: p.y, char: p.char });
        if (p.trail.length > p.trailLength) {
          p.trail.pop();
        }

        // Individual downward fall
        p.y += p.speed * delta;
        p.morphTimer += delta;

        // Occasional mid-fall character morphing
        if (p.morphTimer >= p.morphInterval) {
          p.morphTimer = 0;
          p.char = getRandomGlyph();
        }

        // Edge vertical fading for smooth entry at top and exit at bottom
        let edgeFade = 1.0;
        if (p.y < 50) edgeFade = Math.max(0, p.y / 50);
        else if (p.y > height - 50) edgeFade = Math.max(0, (height - p.y) / 50);

        const currentAlpha = p.baseAlpha * edgeFade;

        ctx.font = `${p.layer >= 3 ? '700 ' : '500 '}${p.fontSize}px 'CourierPrime', Courier, monospace`;

        // 1. Render Trailing Ghost Letters
        for (let t = p.trail.length - 1; t >= 0; t--) {
          const ghost = p.trail[t];
          const trailRatio = 1 - ((t + 1) / (p.trail.length + 1));
          const ghostAlpha = currentAlpha * trailRatio * 0.45;

          if (ghostAlpha > 0.02) {
            if (p.isAccent) {
              ctx.fillStyle = `rgba(${accentRgb}, ${ghostAlpha * 0.7})`;
            } else {
              ctx.fillStyle = `rgba(140, 150, 165, ${ghostAlpha * 0.55})`;
            }
            ctx.fillText(ghost.char, p.x, ghost.y);
          }
        }

        // 2. Render Main Head Letter
        if (p.isAccent) {
          ctx.fillStyle = `rgba(${accentRgb}, ${currentAlpha * 0.90})`;
          if (p.layer === 4) {
            ctx.shadowColor = `rgba(${accentRgb}, 0.5)`;
            ctx.shadowBlur = 6;
          } else {
            ctx.shadowBlur = 0;
          }
        } else {
          // Darkened slate / charcoal steel tone
          ctx.fillStyle = `rgba(165, 175, 190, ${currentAlpha * 0.75})`;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(p.char, p.x, p.y);
        ctx.shadowBlur = 0;

        // When reaching the bottom, respawn cleanly from above the top
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

  // 5. Media Lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'media-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close-btn" id="lightboxClose">[ESC] CLOSE ✕</button>
      <img id="lightboxImg" src="" alt="Enlarged preview">
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

  // 6. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNavPanel');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileToggle.textContent = isOpen ? 'CLOSE ✕' : 'MENU ☰';
    });
  }
});
