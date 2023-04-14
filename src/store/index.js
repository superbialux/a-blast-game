import Vector from "../Math/Vector";
import { types } from "../util/constants";
import randEl from "../util/number";

const indicesToCheck = [
  new Vector(0, 0),
  new Vector(0, -1),
  new Vector(1, 0),
  new Vector(0, 1),
  new Vector(-1, 0),
];

const initialState = {
  moves: [],
  animationQueue: [],
  tiles: [],
  tilesToDestroy: [],
};

const CREATE_TILES = "CREATE_TILES";
const DESTROY_TILE = "DESTROY_TILE";
const REFILL_BOARD = "REFILL_BOARD";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TILES:
      const { size, dim, boardPos } = action.payload;

      const tiles = Array.from({ length: size.x }, (_, x) =>
        Array.from({ length: size.y }, (_, y) => {
          const indices = new Vector(x, y);
          const type = randEl(types);
          const tileSize = Vector.div(dim, size);
          const pos = Vector.mult(indices, tileSize).add(boardPos);

          return { indices, type, pos, dim: tileSize };
        })
      );
      return { ...state, tiles: tiles.flat() };
    case DESTROY_TILE:
      const tile = action.payload;
      const tilesToDestroy = [tile];

      let i = 0;
      while (i < tilesToDestroy.length) {
        for (const index of indicesToCheck) {
          const currentIndices = tilesToDestroy[i].indices;
          const indices = Vector.sub(currentIndices, index);
          const newTile = state.tiles.find(({ indices: ind }) =>
            ind.isEqual(indices)
          );

          if (
            !newTile ||
            newTile.type !== tile.type ||
            tilesToDestroy.find(
              ({ indices }) =>
                indices.x === newTile.indices.x &&
                indices.y === newTile.indices.y
            )
          )
            continue;

          tilesToDestroy.push(newTile);
        }
        i++;
      }
      if (tilesToDestroy.length === 1) return state;

      return { ...state, tilesToDestroy };

    case REFILL_BOARD:
      let columns = [];

      // Find out how many in a column was destroyed and the last tile for refilling the board
      state.tilesToDestroy.forEach((tile) => {
        const col = columns.find(({ key }) => key === tile.indices.x);
        if (col) {
          if (tile.indices.y > col.lastYIndex) {
            col.lastYIndex = tile.indices.y;
          }
          col.length++;
        } else {
          columns = [
            ...columns,
            { key: tile.indices.x, length: 0, lastYIndex: tile.indices.y },
          ];
        }
      });

      columns.forEach((col) => {
        const skipAbove = col.length + 1;

        const tilesToSwap = state.tiles.filter(
          ({ indices }) => indices.x === col.key && indices.y <= col.lastYIndex
        );

        for (let i = tilesToSwap.length - 1; i >= 0; i--) {
          const tile = tilesToSwap[i];
          const swapTile = tilesToSwap.find(
            ({ indices }) =>
              indices.x === tile.indices.x &&
              indices.y === tile.indices.y - skipAbove
          );

          let startPos = Vector.sub(
            tile.pos,
            new Vector(0, skipAbove * tile.dim.y)
          );
          let endPos = tile.pos;

          if (swapTile) {
            tile.type = swapTile.type;
            //startPos = swapTile.pos;
          } else {
            tile.type = randEl(types);
          }
          //tile.pos = startPos;

          // state.dispatch({
          //   type: "animation",
          //   name: "addToQueue",
          //   params: {
          //     startVal: tile.pos.copy(),
          //     endVal: endPos.copy(),
          //     duration: 10,
          //     callback: (pos) => (tile.pos = pos),
          //   },
          // });
        }
      });

      return { ...state, tilesToDestroy: [] };

    default:
      return state;
  }
};

const createStore = (reducer) => {
  let state = reducer(undefined, {});

  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
  };

  return {
    getState,
    dispatch,
  };
};

export const { getState, dispatch } = createStore(reducer);
// export const getState = () => store.getState();
// export const dispatch = (action) => store.dispatch(action);
