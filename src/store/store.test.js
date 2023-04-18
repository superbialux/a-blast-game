import { getState, dispatch, initialState } from '.';
import Vector from '../Math/Vector';
import { settings } from '../util/constants';
import { isBoardPlayable, tileBehavior } from '../util/tiles';
import { createTiles, destroyTiles } from './actions';

describe('common store behavior', () => {
  test('store exists', () => {
    expect(getState()).toBe(initialState);
  });
  test('tiles get created', () => {
    dispatch(createTiles(new Vector(0, 0), new Vector(50, 50)));
    expect(getState().tiles).toHaveLength(settings.size.x * settings.size.y);
  });
  test('there are always tiles that can be destroyed', () => {
    let isPlayable = false;
    for (let i = 0; i < 100; i += 1) {
      dispatch(createTiles(new Vector(0, 0), new Vector(50, 50)));
      isPlayable = isBoardPlayable(getState().tiles);
    }
    expect(isPlayable).toBe(true);
  });
  test('tiles get destroyed and super tile gets created if threshold is met', () => {
    const { tiles } = getState();
    const pairs = [];
    tiles.forEach((clickedTile, i) => {
      const neighbors = [clickedTile];
      let id = 0;

      do {
        const tile = neighbors[id];
        const behavior = tileBehavior.normal;

        behavior.indices.forEach((index) => {
          for (let x = 1; x <= behavior.radius.x; x += 1) {
            for (let y = 1; y <= behavior.radius.y; y += 1) {
              const neighbor = tiles.find(
                ({ indices }) =>
                  indices &&
                  indices.isEqual(Vector.add(tile.indices, Vector.mult(index, new Vector(x, y))))
              );

              if (!neighbor) return;
              if (tile.type !== neighbor.type) return;

              if (!neighbors.find((t) => t.indices.isEqual(neighbor.indices)))
                neighbors.push(neighbor);
            }
          }
        });
        id += 1;
      } while (neighbors[id]);

      pairs[i] = neighbors;
    });

    pairs.sort((a, b) => b.length - a.length);
    const activePair = pairs[0];
    dispatch(destroyTiles(activePair[0]));

    if (activePair.length > settings.superTileThreshold) {
      expect(getState().tiles.filter(({ toDestroy }) => toDestroy)).toHaveLength(
        activePair.length - 1
      );
    } else {
      expect(getState().tiles.filter(({ toDestroy }) => toDestroy)).toHaveLength(activePair.length);
    }
  });
});
