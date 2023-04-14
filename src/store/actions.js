const createTiles = (size, dim, boardPos) => ({
  type: "CREATE_TILES",
  payload: {size, dim, boardPos},
});

export default createTiles;
