const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Lightbox Enlarge functionality for feature media
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.createElement('div');
  lightbox.className = 'media-lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close">[ESC] Close ✕</button>
    <img src="" alt="Enlarged media preview">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Preview';
    lightbox.classList.add('is-active');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightboxImg.src = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });

  document.querySelectorAll('.media-preview-container').forEach(container => {
    container.addEventListener('click', () => {
      const img = container.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });

  // Generic Hero Typewriter Animation helper
  function setupTypewriter(headingId, emphasisId, fullHeading, fullEmphasis) {
    const elHeading = document.getElementById(headingId);
    const elEmphasis = document.getElementById(emphasisId);
    const cursor = elHeading ? elHeading.parentElement.querySelector('.typing-cursor') : null;

    if (elHeading && elEmphasis) {
      elHeading.textContent = "";
      elEmphasis.textContent = "";
      
      let i = 0;
      let j = 0;

      function typeH() {
        if (i < fullHeading.length) {
          elHeading.textContent += fullHeading.charAt(i);
          i++;
          setTimeout(typeH, 45);
        } else {
          setTimeout(typeE, 120);
        }
      }

      function typeE() {
        if (j < fullEmphasis.length) {
          elEmphasis.textContent += fullEmphasis.charAt(j);
          j++;
          setTimeout(typeE, 55);
        } else {
          if (cursor) cursor.classList.add('is-done');
        }
      }

      setTimeout(typeH, 150);
    }
  }

  // Initialize Typewriter Animations for all landing page heroes
  setupTypewriter('typedHeading', 'typedEmphasis', "Tools for the", "story in progress.");
  setupTypewriter('typedFountHeading', 'typedFountEmphasis', "Blockbusters", "in Terminal.");
  setupTypewriter('typedActOneHeading', 'typedActOneEmphasis', "The script", "in full view.");
});
