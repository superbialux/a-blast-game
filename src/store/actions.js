const createTiles = (size, dim, boardPos) => ({
  type: "CREATE_TILES",
  payload: { size, dim, boardPos },
});

const destroyTile = (tile) => ({
  type: "DESTROY_TILE",
  payload: tile,
});

const refillBoard = (tile) => ({
  type: "REFILL_BOARD",
});

const queueAnimation = (anim) => ({
  type: 'QUEUE_ANIMATION',
  payload: anim,
})

const changeScene = (scene) => ({
  type: 'CHANGE_SCENE',
  payload: scene
})

export { createTiles, destroyTile, refillBoard, queueAnimation, changeScene };
