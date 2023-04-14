import Vector from "../Math/Vector";

class Renderer {
  constructor(aspectRatio, context) {
    this.aspectRatio = aspectRatio;
    this.context = context;
    
    const height = Math.min(window.innerHeight, window.innerWidth);
    const width = height * aspectRatio;

    this.res = new Vector(width, height);
    this.canvas = document.createElement("canvas");
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
}

export default Renderer;
