import Vector from "../Math/Vector";

class AnimationController {
  static addToQueue(state, { startVal, endVal, duration, callback }) {
    let frames = 1;

    const anim = () => {
      const time = frames / duration;

      const pos = Vector.add(
        Vector.mult(startVal, 1 - time),
        Vector.mult(endVal, time)
      );

      callback(pos);
      if (time >= 1.0) state.animationQueue = [];

      frames++;
    };

    state.animationQueue.push(anim);
  }
}

export default AnimationController;
