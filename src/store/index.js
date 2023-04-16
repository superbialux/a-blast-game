import Vector from "../Math/Vector";
import { settings, tileBehavior, types } from "../util/constants";
import randEl from "../util/number";
import {
  CHANGE_SCENE,
  CREATE_TILES,
  DESTROY_TILES,
  ON_ALL_ANIMATION_END,
  QUEUE_ANIMATION,
  REFILL_BOARD,
  UPDATE_TILE,
} from "./types";

const initialState = {
  moves: 25,
  score: 0,
  scene: "game",
  animations: [],
  tiles: [],
  onAllAnimationEnd: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SCENE:
      return { ...state, scene: action.payload };
    case CREATE_TILES:
      return { ...state, tiles: action.payload };

    case DESTROY_TILES:
      const clickedTile = action.payload;
      let tilesToDestroy = [clickedTile];

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
        return state; // should not check if the tile is super ???

      return {
        ...state,
        tiles: state.tiles.map((tile) => {
          const convertToSuper =
            tile.indices.isEqual(clickedTile.indices) &&
            tilesToDestroy.length > settings.superTileThreshold;
          return {
            ...tile,
            toDestroy:
              !convertToSuper &&
              !!tilesToDestroy.find(({ indices }) =>
                indices.isEqual(tile.indices)
              ),
            behavior: convertToSuper ? "super" : "normal",
          };
        }),
      };

    case UPDATE_TILE:
      const updatedTile = action.payload;
      return {
        ...state,
        tiles: state.tiles
          .slice()
          .map((tile) =>
            tile.indices.isEqual(updatedTile.indices) ? updatedTile : tile
          ),
      };

    case REFILL_BOARD:
      const pairs = [];
      const phantomBoard = [
        ...state.tiles,
        ...Array.from({ length: settings.size.y }, (_, i) => {
          const indices = new Vector(tile.indices.x, -i - 1); // -1 to -5
          return {
            ...tile,
            toDestroy: false,
            indices,
            type: randEl(types),
            behavior: "normal",
            pos: tile.pos
              .copy()
              .add(Vector.mult(indices, new Vector(0, tile.dim.y))),
          };
        }),
      ]
      
      // Go column by column in a descending order
      for (let x = 0; x <= settings.size.x - 1; x++) {
        //const next
        for (let y = settings.size.y - 1; y >= 0; y--) {
          const newIndices = new Vector(x, y);
          const tile = state.tiles.find(({ indices }) =>
            indices.isEqual(newIndices)
          );
          if (
            !(
              tile.toDestroy ||
              pairs.find(({ pairTile }) =>
                pairTile.indices.isEqual(tile.indices)
              )
            )
          )
            continue;

          // Iterate up until an available tile is found
     
          for (let y = tile.indices.y - 1; y >= -settings.size.y; y--) {
            // Hack: adds fantom tiles above the board
            const upperTile = phantomBoard.find((tileAbove) =>
              tileAbove.indices.isEqual(new Vector(tile.indices.x, y))
            );

            if (upperTile.toDestroy) continue;
            
            if (
              !pairs.find(({ pairTile }) =>
                pairTile.indices.isEqual(upperTile.indices)
              )
            ) {
              pairs.push({ tile, pairTile: upperTile });
              break;
            }
          }
        }
      }

      return {
        ...state,
        tiles: state.tiles.map((tile) => {
          const pair = pairs.find(({ tile: origTile }) =>
            origTile.indices.isEqual(tile.indices)
          );
          if (!pair) return tile;

          return { ...tile, toDestroy: false, type: pair.pairTile.type, pair: pair.pairTile };
        }),
      };

    case QUEUE_ANIMATION:
      return { ...state, animations: [...state.animations, action.payload] };

    case ON_ALL_ANIMATION_END:
      return { ...state, onAllAnimationEnd: action.payload };

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
