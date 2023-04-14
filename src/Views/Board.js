import Vector from "../Math/Vector";
import TileView from "./Tile";
import View from "./View";

class BoardView extends View {
  constructor(ctx, pos, dim) {
    super(ctx, pos, dim);

    this.bgImg;
  }

  preload() {
    const origDim = this.dim.copy()
    this.dim = Vector.mult(this.dim, 1.05)
    this.pos.sub(Vector.sub(this.dim, origDim).div(2))
    this.bgImg = this.assets.find((a) => a.name === "board").src;
  }

  render() {
    this.ctx.drawImage(
      this.bgImg,
      this.pos.x,
      this.pos.y,
      this.dim.x,
      this.dim.y
    );
  }
}

export default BoardView;
