import Vector from "../Math/Vector";
import { types } from "../util/constants";
import randEl from "../util/number";

export const tileDefault = {
  pair: null,
  toDestroy: false,
  behavior: "normal",
  opacity: 1.0,
};

const createTiles = (size, boardPos, dim) => {
  const tiles = Array.from({ length: size.x }, (_, x) =>
    Array.from({ length: size.y }, (_, y) => {
      const indices = new Vector(x, y);
      const tileSize = Vector.div(dim, size);
      const pos = Vector.mult(indices, tileSize).add(boardPos);
      return {
        ...tileDefault,
        indices,
        type: randEl(types),
        pos,
        dim: tileSize,
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

const refillBoard = (board) => ({
  type: "REFILL_BOARD",
  payload: board,
});

const queueAnimation = (anim) => ({
  type: "QUEUE_ANIMATION",
  payload: anim,
});

const changeScene = (scene) => ({
  type: "CHANGE_SCENE",
  payload: scene,
});

const updateScore = (callback) => ({
  type: "UPDATE_SCORE",
  payload: callback,
});

const onAllAnimationEnd = (callback) => ({
  type: "ON_ALL_ANIMATION_END",
  payload: callback,
});

const toggleInteractivity = (bool) => ({
  type: "TOGGLE_INTERACTIVITY",
  payload: bool,
});

export {
  createTiles,
  destroyTiles,
  updateTile,
  refillBoard,
  queueAnimation,
  onAllAnimationEnd,
  updateScore,
  changeScene,
  toggleInteractivity,
};
