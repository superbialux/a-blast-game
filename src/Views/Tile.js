import Animation from "../Animation";
import Vector from "../Math/Vector";
import { dispatch, getState } from "../store";
import { destroyTile, queueAnimation, refillBoard } from "../store/actions";
import View from "./View";

class TileView extends View {
  constructor(ctx, tile, boardBoundaryMin, boardBoundaryMax) {
    super(ctx, tile.pos, tile.dim, "tile");

    this.tile = tile;
    this.dispatch = dispatch;

    this.boardBoundaryMin = boardBoundaryMin;
    this.boardBoundaryMax = boardBoundaryMax;

    this.active = false;
    this.img;
  }

  preload() {
    this.img = this.assets.find((a) => a.name === this.tile.type).src;
  }

  render() {
    let dim = this.tile.dim;
    let pos = this.tile.pos;

    if (
      !(pos.x >= this.boardBoundaryMin.x &&
      pos.y >= this.boardBoundaryMin.y &&
      Math.floor(pos.x + dim.x) <= this.boardBoundaryMax.x &&
      Math.floor(pos.y + dim.y) <= this.boardBoundaryMax.y)
    ) {
      this.ctx.globalAlpha = 0.0;
    }

    this.ctx.drawImage(this.img, pos.x, pos.y, dim.x, dim.y);
    this.ctx.globalAlpha = 1.0;
  }

  update() {
    this.preload();
    this.tile = getState().tiles.find(({ indices }) =>
      indices.isEqual(this.tile.indices)
    );
  }

  handleClick() {
    dispatch(destroyTile(this.tile));
    dispatch(refillBoard());
  }

  swap(tile) {
    this.type = tile.type;
  }

  handleHover() {
    this.active = true;
  }

  handleMouseLeave() {
    this.active = false;
  }
}

export default TileView;
