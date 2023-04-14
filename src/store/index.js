import Vector from "../Math/Vector";
import { types } from "../util/constants";
import randEl from "../util/number";

const initialState = {
  moves: [],
  animationQueue: [],
  tiles: [],
};

const CREATE_TILES = "CREATE_TILES";

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
      return { ...state, tiles };
    default:
      return state;
  }
};

const createStore = (reducer) => {
  let state = reducer(undefined, {});

  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action)
  }

  return {
    getState,
    dispatch,
  };
};

export const { getState, dispatch } = createStore(reducer);
// export const getState = () => store.getState();
// export const dispatch = (action) => store.dispatch(action);
