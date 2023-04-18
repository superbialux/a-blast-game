import { settings } from "../util/constants";

class Animation {
  constructor(callback, duration, onFinish) {
    this.callback = callback;
    this.fps = settings.fps;
    this.duration = duration;
    this.finished = false;
    this.timer = 0;
    this.onFinish = onFinish;
  }

  run() {
    const perc = Math.min(Math.max(0, this.timer / this.duration), 1.0);
    this.callback(perc);

    if (perc === 1) {
      this.finished = true;
      if (this.onFinish) this.onFinish();
    }

    this.timer++;
  }
}

export default Animation;
