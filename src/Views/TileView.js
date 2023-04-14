import BoardController from "../Controllers/BoardController";
import Vector from "../Math/Vector";
import View from "./View";

class TileView extends View {
  constructor(ctx, pos, dim, indices, type) {
    super(ctx, pos, dim, "tile");
    this.indices = indices;
    this.img;
    this.active = false;

    this.type = type;
  }

  preload() {
    this.img = this.assets.find((a) => a.name === this.type).src;
  }

  render() {
    let dim = this.dim.copy().mult(0.98);
    let pos = this.pos.copy().add(Vector.sub(this.dim, dim).div(2));
    if (this.active) {
      dim = this.dim;
      pos = this.pos;
    }
    this.ctx.drawImage(this.img, pos.x, pos.y, dim.x, dim.y);
  }

  handleClick(state) {
    state.dispatch({ type: "board", name: "destroy", params: this });
  }

  swap(tile) {
    this.type = tile.type;
  }

  handleHover(state) {
    this.active = true;
  }

  handleMouseLeave() {
    this.active = false;
  }
}

export default TileView;
