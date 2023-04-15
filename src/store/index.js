import Vector from "../Math/Vector";
import { settings, tileBehavior, types } from "../util/constants";
import randEl from "../util/number";
import {
  CHANGE_SCENE,
  CREATE_TILES,
  DESTROY_TILES,
  QUEUE_ANIMATION,
  REFILL_BOARD,
} from "./types";

const initialState = {
  moves: 25,
  score: 0,
  scene: "game",
  animations: [],
  tiles: [],
  tilesToDestroy: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SCENE:
      return { ...state, scene: action.payload };
    case CREATE_TILES:
      return { ...state, tiles: action.payload };

    case DESTROY_TILES:
      const clickedTile = action.payload;
      const tilesToDestroy = [clickedTile];

      for (const tile of tilesToDestroy) {
        const behavior = tileBehavior[tile.behavior];

        behavior.indices.forEach((index) => {
          // Check if neighbouring tile is to be destroyed
          const neighbor = state.tiles.find(
            ({ indices }) =>
              indices && indices.isEqual(Vector.add(tile.indices, index))
          );

          if (!neighbor) return; // does exist
          if (behavior.checkType && tile.type !== neighbor.type) return; // is of the same type
          // is not already in the array
          if (
            !tilesToDestroy.find(({ indices }) =>
              indices.isEqual(neighbor.indices)
            )
          )
            tilesToDestroy.push(neighbor);
        });
      }

      if (
        clickedTile.behavior === "normal" &&
        tilesToDestroy.length < settings.minTiles
      )
        return state; // should not check if the tile is super

      let allTiles = state.tiles.slice();

      // Convert to super tile
      if (tilesToDestroy.length > settings.superTileThreshold) {
        allTiles = allTiles.map((tile) =>
          tile.indices.isEqual(clickedTile.indices)
            ? { ...clickedTile, behavior: "super" }
            : tile
        );
      }

      return { ...state, tiles: allTiles, tilesToDestroy };

    case REFILL_BOARD:
      return state;

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
