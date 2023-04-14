import { getState } from "../store";

class Animation {
  constructor(callback, duration, delay, onFinish, onStart) {
    this.callback = callback;
    this.fps = getState().fps;
    this.duration = duration;
    this.finished = false;
    this.timer = -delay || 0;
    this.onFinish = onFinish;
    this.onStart = onStart;

    this.onStartInit = false;
  }

  run() {
    if (this.timer > 0) {
      if (this.onStart && !this.onStartInit) {
        this.onStartInit = true;
        this.onStart();
      }
      const perc = this.timer / this.duration;
      this.callback(perc);

      if (perc >= 1.0) {
        this.finished = true;
        if (this.onFinish) this.onFinish();
      }
    }
    this.timer++;
  }
}

export default Animation;
