import Vector from "../Math/Vector";
import { dispatch, getState } from "../store";
import { destroyTile, refillBoard } from "../store/actions";
import View from "./View";

class TileView extends View {
  constructor(ctx, tile) {
    super(ctx, tile.pos, tile.dim, "tile");

    this.tile = tile;
    this.dispatch = dispatch;

    this.active = false;
    this.img;
  }

  preload() {
    this.img = this.assets.find((a) => a.name === this.tile.type).src;
  }

  render() {
    let dim = this.tile.dim.copy();
    let pos = this.tile.pos.copy().add(Vector.sub(this.tile.dim, dim).div(2));
    if (this.active) {
      dim = this.tile.dim.copy();
      pos = this.tile.pos;
    }
    this.ctx.drawImage(this.img, pos.x, pos.y, dim.x, dim.y);
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
