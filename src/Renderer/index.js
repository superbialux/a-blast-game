import Vector from '../Math/Vector';
import { dispatch, getState } from '../store';
import { onAllAnimationEnd } from '../store/actions';
import { settings } from '../util/constants';

class Renderer {
  constructor(context) {
    this.context = context;

    const height = window.innerHeight;
    const width = height * settings.aspectRatio;

    this.res = new Vector(width, height);
    this.canvas = document.createElement('canvas');
    this.scenes = [];
    this.scene = null;
  }

  init() {
    const container = document.createElement('div');
    container.id = 'wrapper';
    container.classList.add('container');

    this.canvas.width = this.res.x;
    this.canvas.height = this.res.y;

    document.body.appendChild(container);
    container.prepend(this.canvas);

    return this.canvas.getContext(this.context);
  }

  addScene(scene) {
    this.scenes = [...this.scenes, scene];
  }

  manageEvent(action, pos) {
    if (!this.scene) return;
    this.scene.manageEvent(action, pos);
  }

  update() {
    this.scene = this.scenes.find(({ name }) => name === getState().scene);
  }

  render(callback) {
    if (!this.scene) return;
    this.scene.clear();

    const animations = getState().animations.filter(({ finished }) => !finished);

    animations.forEach((anim) => anim.run());

    if (!animations.length && getState().onAllAnimationEnd) {
      getState().onAllAnimationEnd();
      dispatch(onAllAnimationEnd(null));
    }

    this.scene.update();
    this.scene.render();

    if (callback) callback();

    setTimeout(() => {
      requestAnimationFrame(() => this.render(callback));
    }, 1000 / settings.fps);
  }
}

export default Renderer;
