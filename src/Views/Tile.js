import Animation from "../Animation";
import Vector from "../Math/Vector";
import { dispatch, getState } from "../store";
import {
  destroyTiles,
  onAllAnimationEnd,
  queueAnimation,
  refillBoard,
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
    this.img = this.assets.find((a) => a.name === this.tile.type).src;
  }

  render() {
    const dim = this.tile.dim;
    const pos = this.tile.pos;

    // if (
    //   !(
    //     pos.x >= this.boardBoundaryMin.x &&
    //     pos.y >= this.boardBoundaryMin.y &&
    //     Math.floor(pos.x + dim.x) <= this.boardBoundaryMax.x &&
    //     Math.floor(pos.y + dim.y) <= this.boardBoundaryMax.y
    //   )
    // ) {
    //   this.ctx.clearRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    // }

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
    dispatch(destroyTiles(this.tile));
    const tiles = getState().tiles;
    for (const tile of tiles) {
      if (!tile.toDestroy) continue;
      const origPos = tile.pos.copy();
      const origDim = tile.dim.copy();

      const callback = (progress) => {
        let { pos, dim } = tile;
        if (this.tile.behavior === "super") {
          pos = Vector.add(
            Vector.mult(tile.pos, 1 - progress),
            Vector.mult(this.tile.pos, progress)
          );
        } else {
          dim = Vector.mult(tile.dim, 1 - progress);
          pos = Vector.add(origPos, Vector.div(origDim, 2)).sub(
            Vector.div(dim, 2)
          );
        }

        dispatch(
          updateTile({
            ...tile,
            pos,
            dim,
          })
        );
      };

      const animation = new Animation(callback, 5);
      dispatch(queueAnimation(animation));
    }

    dispatch(
      onAllAnimationEnd(() => {
        dispatch(refillBoard(this.board));
        getState().tiles.forEach((tile) => {
          if (!tile.pair) return;

          const startPos = tile.pair.pos.copy();
          const endPos = tile.origPos.copy();

          // console.log(startPos, endPos)
          const callback = (progress) => {
            dispatch(
              updateTile({
                ...tile,
                dim: tile.origDim,
                pos: Vector.add(
                  Vector.mult(startPos, 1 - progress),
                  Vector.mult(endPos, progress)
                ),
                pair: null
              })
            );
          };
          const animation = new Animation(callback, 5);
          dispatch(queueAnimation(animation));
        });
      })
    );

    // TODO: Refactor -- kind of cumbersome
    // dispatch(
    //   onAllAnimationEnd(() => {
    //     beforeAnim.forEach((f) => f());
    //     dispatch(refillBoard());
    //     // getState().tilePairings.forEach(({ tile: tileToSwap, swapTile }) => {
    //     //   const tile = getState().tiles.find(({ indices }) =>
    //     //     indices.isEqual(tileToSwap.indices)
    //     //   );

    //     //   const origPos = tile.pos.copy();

    //     //   dispatch(
    //     //     updateTile({
    //     //       ...tile,
    //     //       pos: swapTile.pos,
    //     //     })
    //     //   );

    //     //   const callback = (progress) => {
    //     //     dispatch(
    //     //       updateTile({
    //     //         ...tile,
    //     //         pos: Vector.add(
    //     //           Vector.mult(swapTile.pos.copy(), 1 - progress),
    //     //           Vector.mult(origPos.copy(), progress)
    //     //         ),
    //     //       })
    //     //     );
    //     //   };

    //     //   const animation = new Animation(callback, 5);
    //     //   dispatch(queueAnimation(animation));
    //     // });
    //   })
    // );
  }
}

export default TileView;
