import Vector from "../Math/Vector";
import { types } from "../util/constants";
import randEl from "../util/number";

const createTiles = (size, dim, boardPos) => {
  const tiles = Array.from({ length: size.x }, (_, x) =>
    Array.from({ length: size.y }, (_, y) => {
      const indices = new Vector(x, y);
      const tileSize = Vector.div(dim, size);
      return {
        indices,
        type: randEl(types),
        behavior: "normal",
        pos: Vector.mult(indices, tileSize).add(boardPos),
        dim: tileSize,
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

export {
  createTiles,
  destroyTiles,
  updateTile,
  refillBoard,
  queueAnimation,
  changeScene,
};
