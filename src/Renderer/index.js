import Vector from "../Math/Vector";
import { getState } from "../store";
import { settings } from "../util/constants";

class Renderer {
  constructor(context) {
    this.context = context;

    const height = Math.min(window.innerHeight, window.innerWidth);
    const width = height * settings.aspectRatio;

    this.res = new Vector(width, height);
    this.canvas = document.createElement("canvas");
    this.scenes = [];
  }

  init() {
    const container = document.createElement("div");
    container.classList.add("container");

    this.canvas.width = this.res.x;
    this.canvas.height = this.res.y;

    document.body.appendChild(container);
    container.prepend(this.canvas);

    return this.canvas.getContext(this.context);
  }

  addScene(scene) {
    this.scenes = [...this.scenes, scene];
  }

  render(callback) {
    const scene = this.scenes.find(({ name }) => name === getState().scene);

    scene.clear();

    const animations = getState().animations.filter(
      ({ finished }) => !finished
    );

    for (const anim of animations) {
      anim.run();
    }

    scene.update();
    scene.render();

    if (callback) callback();

    setTimeout(() => {
      requestAnimationFrame(() => this.render(callback));
    }, 1000 / settings.fps);
  }
}

export default Renderer;
