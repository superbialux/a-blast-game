import Vector from "../Math/Vector";
import { types } from "../util/constants";
import randEl from "../util/number";

const createTiles = (size, boardPos, dim) => {
  const tiles = Array.from({ length: size.x }, (_, x) =>
    Array.from({ length: size.y }, (_, y) => {
      const indices = new Vector(x, y);
      const tileSize = Vector.div(dim, size);
      const pos = Vector.mult(indices, tileSize).add(boardPos);
      return {
        indices,
        type: randEl(types),
        behavior: "normal",
        pos,
        dim: tileSize,
        pair: null,
        toDestroy: false,
        render: true,
        origPos: pos.copy(),
        origDim: tileSize.copy(),
      };
    })
  );
  return {
    type: "CREATE_TILES",
    payload: tiles.flat(),
  };
};

const destroyTiles = (tile) => ({
  type: "DESTROY_TILES",
  payload: tile,
});

const updateTile = (tile) => ({
  type: "UPDATE_TILE",
  payload: tile,
});

const refillBoard = () => ({
  type: "REFILL_BOARD",
});

const queueAnimation = (anim) => ({
  type: "QUEUE_ANIMATION",
  payload: anim,
});

const changeScene = (scene) => ({
  type: "CHANGE_SCENE",
  payload: scene,
});

const onAllAnimationEnd = (callback) => ({
  type: "ON_ALL_ANIMATION_END",
  payload: callback,
});

export {
  createTiles,
  destroyTiles,
  updateTile,
  refillBoard,
  queueAnimation,
  onAllAnimationEnd,
  changeScene,
};
