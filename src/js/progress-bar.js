/*
 * goslings-client.js
 * https://github.com/kaitoy/goslings-client.js
 * MIT licensed
 *
 * Copyright (C) 2016 Kaito Yamada
 */

class ProgressBar {

  constructor() {
    this.progressBar = document.querySelector('.mdl-js-progress');
    this.inProgress = false;
  }

  setInProgress(inProgress) {
    if (this.inProgress === inProgress) {
      return;
    }

    if (inProgress) {
      this.progressBar.classList.add('mdl-progress__indeterminate');
      this.inProgress = true;
    } else {
      this.progressBar.classList.remove('mdl-progress__indeterminate');
      this.inProgress = false;
    }
  }

}

export default new ProgressBar();
