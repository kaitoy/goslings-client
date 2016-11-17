/*
 * goslings-client.js
 * https://github.com/kaitoy/goslings-client.js
 * MIT licensed
 *
 * Copyright (C) 2016 Kaito Yamada
 */

import dialogPolyfill from 'dialog-polyfill';
import Clipboard from 'clipboard';

const contentsDialog = document.getElementById('goslings-contents-dialog');
dialogPolyfill.registerDialog(contentsDialog);
const errDialog = document.getElementById('goslings-error-dialog');
dialogPolyfill.registerDialog(errDialog);

function init() {
  const contentsDialogButtons = contentsDialog.querySelectorAll('.mdl-button');
  contentsDialogButtons.forEach((elem) => {
    switch (elem.textContent) {
      case 'Close':
        elem.addEventListener('click', () => contentsDialog.close());
        break;
      case 'Copy':
        new Clipboard(elem); // eslint-disable-line no-new
        break;
      default :
        // Just to make eslint happy.
    }
  });

  const errDialogButton = errDialog.querySelector('.mdl-button');
  errDialogButton.addEventListener('click', () => errDialog.close());
}

function showError(message) {
  errDialog.querySelector('.mdl-dialog__content p').textContent = message;
  errDialog.showModal();

  const rect = errDialog.getBoundingClientRect();
  errDialog.style.top
    = `${(document.documentElement.clientHeight - rect.height) / 2}px`;
}

function showObjectContents(contents, x, y) {
  contentsDialog.style.top = `${y}px`;
  contentsDialog.style.bottom = '';
  contentsDialog.style.left = `${x + 30}px`;

  contentsDialog.querySelector('.mdl-dialog__content pre').textContent = contents.text;
  contentsDialog.show();

  const container = document.getElementById('network-container');
  if (contentsDialog.offsetTop + contentsDialog.offsetHeight > container.clientHeight) {
    contentsDialog.style.top = '';
    contentsDialog.style.bottom = '10px';
  }
  if (contentsDialog.offsetLeft + contentsDialog.offsetWidth > container.clientWidth) {
    contentsDialog.style.left = `${Math.max(x - contentsDialog.offsetWidth - 30, 0)}px`;
  }
}

function closeObjectContentsDialog() {
  if (contentsDialog.open) {
    contentsDialog.close();
  }
}

export default {
  init,
  showError,
  showObjectContents,
  closeObjectContentsDialog,
};
