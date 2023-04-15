import Vector from "../Math/Vector";
import { types } from "../util/constants";
import randEl from "../util/number";

const createTiles = (size, dim, boardPos) => {
  const tiles = Array.from({ length: size.x }, (_, x) =>
    Array.from({ length: size.y }, (_, y) => {
      const indices = new Vector(x, y);
      const type = randEl(types);
      const behavior = "normal";
      const tileSize = Vector.div(dim, size);
      const pos = Vector.mult(indices, tileSize).add(boardPos);

      return { indices, type, behavior, pos, dim: tileSize };
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

export { createTiles, destroyTiles, refillBoard, queueAnimation, changeScene };
