import Animation from '../Animation';
import Vector from '../Math/Vector';
import { settings, tileBehavior, types } from '../util/constants';
import randEl from '../util/number';
import { tileDefault, updateTile } from './actions';
import {
  CHANGE_SCENE,
  CREATE_TILES,
  DESTROY_TILES,
  ON_ALL_ANIMATION_END,
  QUEUE_ANIMATION,
  REFILL_BOARD,
  TOGGLE_INTERACTIVITY,
  UPDATE_SCORE,
  UPDATE_TILE,
} from './types';

export const initialState = {
  moves: 25,
  score: 0,
  scene: 'game',
  animations: [],
  tiles: [],
  onAllAnimationEnd: null,
  canInteract: true,
};

const reducer = (action, state = initialState) => {
  switch (action.type) {
    case CHANGE_SCENE:
      return { ...state, scene: action.payload };
    case CREATE_TILES:
      return { ...state, tiles: action.payload };

    case DESTROY_TILES: {
      let clickedTile = action.payload;
      const tilesToDestroy = [{ tile: clickedTile, recursive: true }];

      // eslint-disable-next-line no-restricted-syntax
      for (const { tile, recursive } of tilesToDestroy) {
        if (!recursive) continue;
        const behavior = tileBehavior[tile.behavior];

        behavior.indices.forEach((index) => {
          for (let x = 1; x <= behavior.radius.x; x += 1) {
            for (let y = 1; y <= behavior.radius.y; y += 1) {
              const neighbor = state.tiles.find(
                ({ indices }) =>
                  indices &&
                  indices.isEqual(Vector.add(tile.indices, Vector.mult(index, new Vector(x, y))))
              );

              if (!neighbor) return; // does exist
              if (behavior.checkType && tile.type !== neighbor.type) return; // is of the same type
              if (tile.behavior === 'normal' && neighbor.behavior === 'super') return; // skip if behavior is super
              // is not already in the array
              if (
                !tilesToDestroy.find(({ tile: destroyedTile }) =>
                  destroyedTile.indices.isEqual(neighbor.indices)
                )
              )
                tilesToDestroy.push({
                  tile: neighbor,
                  recursive: behavior.recursive || neighbor.behavior === 'super',
                });
            }
          }
        });
      }

      if (clickedTile.behavior === 'normal' && tilesToDestroy.length < settings.minTiles)
        return state; // should not check if the tile is super
      const newTiles = state.tiles.map((tile) => {
        const isClicked = tile.indices.isEqual(clickedTile.indices);
        const isSuper = tile.behavior === 'super';
        const convertToSuper =
          isClicked && tilesToDestroy.length > settings.superTileThreshold && !isSuper;

        const convertToNormal = isClicked && isSuper;

        let { behavior } = tile;
        if (convertToSuper) {
          behavior = 'super';
        }
        if (convertToNormal) {
          behavior = 'nomrla';
        }

        return {
          ...tile,
          toDestroy:
            !convertToSuper &&
            !!tilesToDestroy.find(({ tile: destroyedTile }) =>
              destroyedTile.indices.isEqual(tile.indices)
            ),
          // Conversion logic
          behavior,
        };
      });

      clickedTile = newTiles.find((tile) => tile.indices.isEqual(clickedTile.indices)); // recheck clicked tile if it changed to super
      return {
        ...state,
        tiles: newTiles,
        animations: newTiles
          .filter((tile) => tile.toDestroy)
          .map((tile) => {
            const origPos = tile.origPos.copy();
            const origDim = tile.origDim.copy();

            const callback = (progress) => {
              let { pos, dim } = tile;
              if (clickedTile.behavior === 'super') {
                pos = Vector.add(
                  Vector.mult(tile.pos, 1 - progress),
                  Vector.mult(clickedTile.pos, progress)
                );
              } else {
                dim = Vector.mult(tile.dim, 1 - progress);
                pos = Vector.add(origPos, Vector.div(origDim, 2)).sub(Vector.div(dim, 2));
              }

              dispatch(
                updateTile({
                  ...tile,
                  pos,
                  dim,
                  opacity: 1 - progress,
                })
              );
            };

            return new Animation(callback, 5);
          }),
      };
    }
    case UPDATE_TILE: {
      const updatedTile = action.payload;
      return {
        ...state,
        tiles: state.tiles
          .slice()
          .map((tile) => (tile.indices.isEqual(updatedTile.indices) ? updatedTile : tile)),
      };
    }
    case REFILL_BOARD: {
      const pairs = [];

      // Hack: create phantom tiles above the original board.
      const phantomTiles = [
        ...state.tiles,
        ...Array.from({ length: settings.size.x }, (_, x) =>
          Array.from({ length: settings.size.y }, (__, i) => {
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
      for (let x = 0; x <= settings.size.x - 1; x += 1) {
        for (let y = settings.size.y - 1; y >= 0; y -= 1) {
          const newIndices = new Vector(x, y);
          const tile = state.tiles.find(({ indices }) => indices.isEqual(newIndices));
          if (
            !(
              tile.toDestroy || pairs.find(({ pairTile }) => pairTile.indices.isEqual(tile.indices))
            )
          )
            continue;

          // Iterate up until an available tile is found
          for (let i = tile.indices.y - 1; i >= -settings.size.y; i -= 1) {
            const upperTile = phantomTiles.find((tileAbove) =>
              tileAbove.indices.isEqual(new Vector(tile.indices.x, i))
            );

            if (upperTile.toDestroy) continue;

            if (!pairs.find(({ pairTile }) => pairTile.indices.isEqual(upperTile.indices))) {
              pairs.push({ tile, pairTile: upperTile });
              break;
            }
          }
        }
      }
      const updatedTiles = state.tiles.map((tile) => {
        const pair = pairs.find(({ tile: origTile }) => origTile.indices.isEqual(tile.indices));
        if (!pair) return tile;

        return {
          ...tile,
          toDestroy: false,
          behavior: pair.pairTile.behavior,
          type: pair.pairTile.type,
          pair: pair.pairTile,
        };
      });
      return {
        ...state,
        tiles: updatedTiles,
        animations: updatedTiles
          .filter((tile) => tile.pair)
          .map((tile) => {
            const startPos = tile.pair.pos.copy();
            const endPos = tile.origPos.copy();

            const callback = (progress) => {
              dispatch(
                updateTile({
                  ...tile,
                  dim: tile.origDim,
                  pos: Vector.add(
                    Vector.mult(startPos, 1 - progress),
                    Vector.mult(endPos, progress)
                  ),
                  opacity: 1,
                  pair: null,
                })
              );
            };

            return new Animation(callback, 5);
          }),
      };
    }
    case UPDATE_SCORE:
      return {
        ...state,
        moves: state.moves - 1,
        score: state.score + state.tiles.filter((tile) => tile.toDestroy).length,
      };

    case QUEUE_ANIMATION:
      return { ...state, animations: [...state.animations, action.payload] };

    case ON_ALL_ANIMATION_END:
      return { ...state, onAllAnimationEnd: action.payload };

    case TOGGLE_INTERACTIVITY:
      if (action.payload === undefined) return { ...state, canInteract: !state.canInteract };
      return { ...state, canInteract: action.payload };
    default:
      return state;
  }
};

const createStore = (reduce) => {
  let state = reduce({}, undefined);

  const getState = () => state;
  const dispatch = (action) => {
    state = reduce(action, state);
  };
  const dispatchAll = (actions) => actions.forEach((action) => dispatch(action));

  return {
    getState,
    dispatch,
    dispatchAll,
  };
};

export const { getState, dispatch, dispatchAll } = createStore(reducer);
