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
