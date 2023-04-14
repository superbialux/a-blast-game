import Vector from "../Math/Vector";
import _ from "lodash";

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
    this.viewType = type || 'common-view'
  }

  clear() {
    this.ctx.clearRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }

  render() {}

  update() {}

  handleClick() {}

  handleHover() {}

  handleMouseLeave() {};

  preload() {}
}

export default View;
