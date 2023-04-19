import Vector from '../Math/Vector';

import { settings, types } from '../util/constants';
import randEl from '../util/number';
import { isBoardPlayable, tileDefault } from '../util/tiles';

const createTiles = (boardPos, dim) => {
  let tiles = [];
  while (!isBoardPlayable(tiles)) {
    tiles = Array.from({ length: settings.size.x }, (_, x) =>
      Array.from({ length: settings.size.y }, (__, y) => {
        const indices = new Vector(x, y);
        const tileSize = Vector.div(dim, settings.size);
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
    ).flat();
  }

  return {
    type: 'CREATE_TILES',
    payload: tiles.flat(),
  };
};

const destroyTiles = (tile) => ({
  type: 'DESTROY_TILES',
  payload: tile,
});

const updateTile = (tile) => ({
  type: 'UPDATE_TILE',
  payload: tile,
});

const refillBoard = () => ({
  type: 'REFILL_BOARD',
});

const shuffleBoard = () => ({
  type: 'SHUFFLE_BOARD',
});

const queueAnimation = (anim) => ({
  type: 'QUEUE_ANIMATION',
  payload: anim,
});

const changeScene = (scene) => ({
  type: 'CHANGE_SCENE',
  payload: scene,
});

const updateScore = (callback) => ({
  type: 'UPDATE_SCORE',
  payload: callback,
});

const onAllAnimationEnd = (callback) => ({
  type: 'ON_ALL_ANIMATION_END',
  payload: callback,
});

const toggleInteractivity = (bool) => ({
  type: 'TOGGLE_INTERACTIVITY',
  payload: bool,
});

const runOnClick = (event) => ({
  type: 'RUN_ON_CLICK',
  payload: event,
});

const createBoosters = (boosters) => {
  const boostersObj = {};

  boosters.forEach((booster) => {
    boostersObj[booster.name] = {
      action: booster.action,
      count: booster.count,
    };
  });

  return {
    type: 'CREATE_BOOSTERS',
    payload: boostersObj,
  };
};

export {
  createTiles,
  destroyTiles,
  updateTile,
  refillBoard,
  shuffleBoard,
  queueAnimation,
  onAllAnimationEnd,
  updateScore,
  changeScene,
  toggleInteractivity,
  runOnClick,
  createBoosters,
};
