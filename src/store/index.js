import Animation from "../Animation";
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
  fps: 60,
  moves: 25,
  score: 0,
  animations: [],
  tiles: [],
  tilesToDestroy: [],
};

const CREATE_TILES = "CREATE_TILES";
const DESTROY_TILE = "DESTROY_TILE";
const REFILL_BOARD = "REFILL_BOARD";
const QUEUE_ANIMATION = "QUEUE_ANIMATION";

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

      const newAnimations = [];

      tilesToDestroy.forEach((tile) => {
        const originDim = tile.dim.copy();
        const originPos = tile.pos.copy();

        const a = (timer) => {
          tile.dim = Vector.add(
            Vector.mult(tile.dim.copy(), 1 - timer),
            Vector.mult(new Vector(0, 0), timer)
          );
          tile.pos = Vector.add(
            originPos,
            Vector.sub(originDim, tile.dim).div(2)
          );
        };

        newAnimations.push(
          new Animation(a, 10, 0, () => {
            tile.dim = originDim;
            tile.pos = originPos;
          })
        );
      });

      return {
        ...state,
        animations: [...state.animations, ...newAnimations],
        tilesToDestroy,
        score: state.score + tilesToDestroy.length,
        moves: state.moves - 1,
      };

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
      const animations = [];
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

          const pos = (timer) =>
            (tile.pos = Vector.add(
              Vector.mult(startPos.copy(), 1 - timer),
              Vector.mult(endPos.copy(), timer)
            ));
          animations.push(
            new Animation(pos, 8, 9, null, () => {
              if (swapTile) {
                tile.type = swapTile.type;
                startPos = swapTile.pos;
              } else {
                tile.type = randEl(types);
              }
              tile.pos = startPos;
            })
          );
        }
      });

      return {
        ...state,
        animations: [...state.animations, ...animations],
        tilesToDestroy: [],
      };

    case QUEUE_ANIMATION:
      return { ...state, animations: [...state.animations, action.payload] };

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
