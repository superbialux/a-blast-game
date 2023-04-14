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

export { createTiles, destroyTile, refillBoard };
