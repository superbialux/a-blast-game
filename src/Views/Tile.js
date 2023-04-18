import Animation from "../Animation";
import Vector from "../Math/Vector";
import { dispatch, dispatchAll, getState } from "../store";
import {
  destroyTiles,
  onAllAnimationEnd,
  queueAnimation,
  refillBoard,
  toggleInteractivity,
  updateScore,
  updateTile,
} from "../store/actions";
import { settings } from "../util/constants";
import View from "./View";

class TileView extends View {
  constructor(ctx, tile, board) {
    super(ctx, tile.pos, tile.dim, "tile");

    this.tile = tile;
    this.dispatch = dispatch;

    this.board = board;

    this.active = false;
    this.isVisible = true;
    this.img;
  }

  preload() {
    this.img = this.assets.find(
      (a) =>
        a.name === (this.tile.behavior === "super" ? "super" : this.tile.type)
    ).src;
  }

  render() {
    const dim = this.tile.dim;
    const pos = this.tile.pos;

    this.ctx.globalAlpha = this.tile.opacity;

    if (
      !(
        Math.ceil(pos.x) >= this.board.boundaryMin.x &&
        Math.ceil(pos.y) >= this.board.boundaryMin.y &&
        Math.floor(pos.x + dim.x) <= this.board.boundaryMax.x &&
        Math.floor(pos.y + dim.y) <= this.board.boundaryMax.y
      )
    ) {
      this.ctx.globalAlpha = 0.0;
    }

    this.ctx.drawImage(this.img, pos.x, pos.y, dim.x, dim.y);
    this.ctx.globalAlpha = 1.0;
  }

  update() {
    this.preload();
    // Keep reference to the array in the store
    this.tile = getState().tiles.find(({ indices }) =>
      indices.isEqual(this.tile.indices)
    );
  }

  handleClick() {
    dispatchAll([
      toggleInteractivity(),
      destroyTiles(this.tile),
      updateScore(),
      onAllAnimationEnd(() => {
        dispatch(refillBoard(this.board))
        dispatch(toggleInteractivity())
      }),
    ]);
  }
}

export default TileView;
