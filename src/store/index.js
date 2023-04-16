import Vector from "../Math/Vector";
import { settings, tileBehavior, types } from "../util/constants";
import randEl from "../util/number";
import { tileDefault } from "./actions";
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
      let tilesToDestroy = [{ tile: clickedTile, recursive: true }];

      for (const { tile, recursive } of tilesToDestroy) {
        if (!recursive) continue;
        const behavior = tileBehavior[tile.behavior];

        behavior.indices.forEach((index) => {
          for (let x = 1; x <= behavior.radius.x; x++) {
            for (let y = 1; y <= behavior.radius.y; y++) {
              const neighbor = state.tiles.find(
                ({ indices }) =>
                  indices &&
                  indices.isEqual(
                    Vector.add(
                      tile.indices,
                      Vector.mult(index, new Vector(x, y))
                    )
                  )
              );

              if (!neighbor) return; // does exist
              if (behavior.checkType && tile.type !== neighbor.type) return; // is of the same type
              if (tile.behavior === "normal" && neighbor.behavior === "super")
                return; // skip if behavior is super
              // is not already in the array
              if (
                !tilesToDestroy.find(({ tile: destroyedTile }) =>
                  destroyedTile.indices.isEqual(neighbor.indices)
                )
              )
                tilesToDestroy.push({
                  tile: neighbor,
                  recursive:
                    behavior.recursive || neighbor.behavior === "super",
                });
            }
          }
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
            tilesToDestroy.length > settings.superTileThreshold &&
            tile.behavior !== "super";

          const convertToNormal =
            tile.indices.isEqual(clickedTile.indices) &&
            tile.behavior === "super";

          return {
            ...tile,
            toDestroy:
              !convertToSuper &&
              !!tilesToDestroy.find(({ tile: destroyedTile }) =>
                destroyedTile.indices.isEqual(tile.indices)
              ),
            behavior: convertToSuper
              ? "super"
              : convertToNormal
              ? "normal"
              : tile.behavior,
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

      // Kind of cumbersome but have to do it to get board pos and size

      const phantomTiles = [
        ...state.tiles,
        ...Array.from({ length: settings.size.x }, (_, x) =>
          Array.from({ length: settings.size.y }, (_, i) => {
            const indices = new Vector(x, -i - 1); // -1 to -5
            const tileSize = Vector.div(action.payload.dim, settings.size);
            const pos = Vector.mult(indices, tileSize).add(action.payload.pos);

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
        ).flat(),
      ];

      // Go column by column in a descending order
      for (let x = 0; x <= settings.size.x - 1; x++) {
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
            const upperTile = phantomTiles.find((tileAbove) =>
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

          return {
            ...tile,
            toDestroy: false,
            behavior: pair.pairTile.behavior,
            type: pair.pairTile.type,
            pair: pair.pairTile,
          };
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
