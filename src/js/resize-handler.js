/*
 * goslings-client.js
 * https://github.com/kaitoy/goslings-client.js
 * MIT licensed
 *
 * Copyright (C) 2016 Kaito Yamada
 */

class ResizeHandler {

  constructor() {
    this.listeners = [];
    this.fps = 30;
    this.isRunning = false;

    let schedule;
    if (window.requestAnimationFrame) {
      schedule = () => {
        window.requestAnimationFrame(() => this.fire());
      };
    } else {
      schedule = () => {
        setTimeout(() => this.fire(), 1000 / this.fps);
      };
    }
    window.addEventListener('resize', () => {
      if (!this.isRunning) {
        this.isRunning = true;
        schedule();
      }
    });
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners.splice(listener, 1);
  }

  fire() {
    this.listeners.forEach((listener) => {
      listener();
    });
    this.isRunning = false;
  }

}

export default new ResizeHandler();
