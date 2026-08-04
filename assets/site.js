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

  // Hero Typewriter Animation
  const typedHeading = document.getElementById('typedHeading');
  const typedEmphasis = document.getElementById('typedEmphasis');
  const typingCursor = document.querySelector('.typing-cursor');

  if (typedHeading && typedEmphasis) {
    const fullTextHeading = "Tools for the";
    const fullTextEmphasis = "story in progress.";
    
    typedHeading.textContent = "";
    typedEmphasis.textContent = "";
    
    let i = 0;
    let j = 0;

    function typeHeading() {
      if (i < fullTextHeading.length) {
        typedHeading.textContent += fullTextHeading.charAt(i);
        i++;
        setTimeout(typeHeading, 45);
      } else {
        setTimeout(typeEmphasis, 120);
      }
    }

    function typeEmphasis() {
      if (j < fullTextEmphasis.length) {
        typedEmphasis.textContent += fullTextEmphasis.charAt(j);
        j++;
        setTimeout(typeEmphasis, 55);
      } else {
        // Keep cursor blinking softly at the end
        if (typingCursor) {
          typingCursor.classList.add('is-done');
        }
      }
    }

    setTimeout(typeHeading, 150);
  }
});
