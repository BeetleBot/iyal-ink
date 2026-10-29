const flatpakDialog = document.getElementById('flatpak-dialog');
const flatpakTrigger = document.getElementById('open-flatpak');
flatpakTrigger.addEventListener('click', () => {
  flatpakDialog.showModal();
  document.body.classList.add('flatpak-open');
});
flatpakDialog.addEventListener('close', () => {
  document.body.classList.remove('flatpak-open');
  flatpakTrigger.focus();
});
flatpakDialog.addEventListener('click', event => {
  if (event.target !== flatpakDialog) return;
  const bounds = flatpakDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) flatpakDialog.close();
});
