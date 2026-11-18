'use strict';

function folderPath(link) {
  const url = new URL(link.href);
  if (url.protocol !== 'file:') return url.href;

  const pathname = decodeURIComponent(url.pathname).replaceAll('/', '\\');
  if (url.hostname) return '\\\\' + url.hostname + pathname;
  return pathname.replace(/^\\(?=[a-z]:\\)/i, '');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.readOnly = true;
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    try {
      if (!document.execCommand('copy')) throw new Error('Copy failed');
    } finally {
      field.remove();
    }
  }
}

for (const button of document.querySelectorAll('.copy-folder')) {
  const link = button.previousElementSibling;
  const status = button.nextElementSibling;
  button.addEventListener('click', async () => {
    status.textContent = '';
    const text = folderPath(link);
    try {
      await copyText(text);
      status.textContent = 'Másolva';
    } catch {
      window.prompt('Másold ki a mappa útvonalát:', text);
    } finally {
      button.focus();
    }
  });
}
