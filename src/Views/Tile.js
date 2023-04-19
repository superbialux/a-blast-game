import { dispatch, dispatchAll, getState } from '../store';
import {
  destroyTiles,
  onAllAnimationEnd,
  refillBoard,
  toggleInteractivity,
  updateScore,
} from '../store/actions';
import View from './View';

class TileView extends View {
  constructor(ctx, tile, board) {
    super(ctx, tile.pos, tile.dim, 'tile');

    this.tile = tile;
    this.dispatch = dispatch;

    this.board = board;

    this.active = false;
    this.isVisible = true;
    this.img = null;
  }

  preload() {
    this.img = this.assets[this.tile.behavior !== 'normal' ? this.tile.behavior : this.tile.type];
  }

  render() {
    const { dim, pos } = this.tile;

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
    this.tile = getState().tiles.find(({ indices }) => indices.isEqual(this.tile.indices));
  }

  handleClick() {
    dispatchAll([
      toggleInteractivity(),
      destroyTiles(this.tile),
      updateScore(),
      onAllAnimationEnd(() => {
        dispatch(refillBoard());
        dispatch(toggleInteractivity());
      }),
    ]);
  }
}

export default TileView;
