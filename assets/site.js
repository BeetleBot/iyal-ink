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

  // Hero Typewriter Animation helper with height reservation
  function setupTypewriter(headingId, emphasisId, fullHeading, fullEmphasis) {
    const elHeading = document.getElementById(headingId);
    const elEmphasis = document.getElementById(emphasisId);

    if (elHeading && elEmphasis) {
      // Pre-set full text invisible placeholder to lock height immediately
      elHeading.innerHTML = `<span style="visibility:hidden">${fullHeading}</span>`;
      elEmphasis.innerHTML = `<span style="visibility:hidden">${fullEmphasis}</span>`;
      
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '|';

      let i = 0;
      let j = 0;

      function typeH() {
        if (i <= fullHeading.length) {
          elHeading.innerHTML = fullHeading.substring(0, i);
          elHeading.appendChild(cursor);
          i++;
          setTimeout(typeH, 45);
        } else {
          setTimeout(startEmphasis, 120);
        }
      }

      function startEmphasis() {
        elEmphasis.innerHTML = "";
        elEmphasis.appendChild(cursor);
        typeE();
      }

      function typeE() {
        if (j <= fullEmphasis.length) {
          elEmphasis.innerHTML = fullEmphasis.substring(0, j);
          elEmphasis.appendChild(cursor);
          j++;
          setTimeout(typeE, 55);
        } else {
          cursor.classList.add('is-done');
        }
      }

      setTimeout(typeH, 150);
    }
  }

  function setupSingleTypewriter(id, text) {
    const element = document.getElementById(id);
    if (!element) return;

    element.innerHTML = `<span style="visibility:hidden">${text}</span>`;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    let i = 0;

    function type() {
      if (i <= text.length) {
        element.innerHTML = text.substring(0, i);
        element.appendChild(cursor);
        i++;
        setTimeout(type, 55);
      } else {
        cursor.classList.add('is-done');
      }
    }

    setTimeout(type, 180);
  }

  // Initialize Typewriter Animations for all landing page heroes
  setupTypewriter('typedHeading', 'typedEmphasis', "Tools for the", "story in progress.");
  setupTypewriter('typedFountHeading', 'typedFountEmphasis', "Blockbusters", "in Terminal.");
  setupTypewriter('typedActOneHeading', 'typedActOneEmphasis', "The script", "in full view.");
  setupSingleTypewriter('typedFountDownloadTitle', 'Fount TUI');
  setupSingleTypewriter('typedActOneDownloadTitle', 'ActOne Screenplay');
});
