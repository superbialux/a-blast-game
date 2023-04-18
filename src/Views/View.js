import Vector from "../Math/Vector";
import _ from "lodash";
import store from "../store";

class View {
  constructor(ctx, pos, dim, type) {
    this.ctx = ctx;
    this.pos = pos;
    this.dim = dim;
    this.area = dim.x * dim.y;

    this.boundaryMin = pos.copy();
    this.boundaryMax = Vector.add(pos, dim);

    this.assets = [];

    this.id = _.uniqueId();
    this.viewType = type || "common-view";
  }

  clear() {
    this.ctx.clearRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }

  render() {}

  update() {}

  handleClick() {}

  handleHover() {}

  handleMouseLeave() {}

  preload() {}

  addText(title, fontSize, pos) {
    this.ctx.textAlign = "center";
    this.ctx.font = `${fontSize}px Seymour One`;

    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(title, pos.x, pos.y);
  }
}

export default View;
