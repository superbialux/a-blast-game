import Vector from "../Math/Vector";
import TileView from "./Tile";
import View from "./View";

class BoardView extends View {
  constructor(ctx, pos, dim) {
    super(ctx, pos, dim);

    this.bgImg;
  }

  preload() {
    this.bgImg = this.assets.find((a) => a.name === "board").src;
  }

  render() {
    const dim = Vector.mult(this.dim, 1.1);
    const pos = Vector.sub(this.pos, Vector.div(Vector.sub(dim, this.dim), 2));
    this.ctx.drawImage(
      this.bgImg,
      pos.x,
      pos.y,
      dim.x,
      dim.y
    );
  }
}

export default BoardView;
