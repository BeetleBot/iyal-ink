// Resolve release metadata from this script, including on a subdomain or nested page.
const releaseURL = new URL('version.json', document.currentScript.src);
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(releaseURL, { cache: 'no-cache' });
    if (!response.ok) return;
    const { version } = await response.json();
    if (!/^\d+\.\d+\.\d+$/.test(version)) return;
    document.querySelectorAll('[data-version="badge"]').forEach(el => {
      el.textContent = `v${version} Beta`;
    });
  } catch { /* Keep the embedded release label when offline. */ }
});

// A native modal keeps enlarged screenshots on the current page and manages focus.
document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('button.screenshot-link');
  if (!triggers.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'screenshot-dialog';
  dialog.setAttribute('aria-label', 'Enlarged screenshot');
  dialog.innerHTML = '<button type="button" class="screenshot-close" aria-label="Close enlarged screenshot" autofocus>Close ×</button><img alt=""><p class="screenshot-caption"></p>';
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  triggers.forEach(trigger => {
    const thumbnail = trigger.querySelector('img');
    trigger.setAttribute('aria-label', `Enlarge screenshot: ${thumbnail.alt}`);
    trigger.addEventListener('click', () => {
      image.src = thumbnail.currentSrc || thumbnail.src;
      image.alt = thumbnail.alt;
      caption.textContent = thumbnail.alt;
      dialog.showModal();
      document.body.classList.add('screenshot-open');
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('screenshot-open'));
});
