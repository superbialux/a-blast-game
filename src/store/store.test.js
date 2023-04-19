import { getState, dispatch, initialState } from '.';
import Vector from '../Math/Vector';
import { settings } from '../util/constants';
import { isBoardPlayable, tileBehavior } from '../util/tiles';
import { createTiles, destroyTiles, refillBoard, updateTile } from './actions';

describe('common store behavior', () => {
  const pos = new Vector(0, 0);
  const dim = new Vector(50, 50);
  test('store exists', () => {
    expect(getState()).toBe(initialState);
  });
  test('tiles get created', () => {
    dispatch(createTiles(pos, dim));
    expect(getState().tiles).toHaveLength(settings.size.x * settings.size.y);
  });
  test('there are always tiles that can be destroyed', () => {
    let isPlayable = false;
    for (let i = 0; i < 100; i += 1) {
      dispatch(createTiles(pos, dim));
      isPlayable = isBoardPlayable(getState().tiles);
    }
    expect(isPlayable).toBe(true);
  });
  test('tiles get destroyed and super tile gets created if threshold is met', () => {
    dispatch(createTiles(pos, dim));
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
  test('board gets refilled and types get changed', () => {
    const { tiles: tilesBefore } = getState();

    dispatch(refillBoard({ pos, dim }));

    const { tiles } = getState();
    expect(tilesBefore.map(({ type }) => type)).not.toStrictEqual(tiles.map(({ type }) => type));

    const destroyedTiles = tiles.filter(({ toDestroy }) => toDestroy);
    expect(destroyedTiles).toHaveLength(0);

    const pairs = tiles.filter(({ pair }) => pair);
    expect(pairs).not.toHaveLength(0);
  });

  const centerIndices = new Vector(
    Math.floor(settings.size.x * 0.5),
    Math.floor(settings.size.y * 0.5)
  );

  test('individual tiles get updated successfully', () => {
    dispatch(createTiles(pos, dim));
    const { tiles } = getState();

    const centerTile = {
      ...tiles.find(({ indices }) => indices.isEqual(centerIndices)),
      behavior: 'super',
    };
    dispatch(updateTile(centerTile));
    expect(getState().tiles.find(({ indices }) => indices.isEqual(centerIndices))).toBe(centerTile);

    const neighborIndices = Vector.add(centerIndices, new Vector(0, 1));
    const neighborTile = {
      ...tiles.find(({ indices }) => indices.isEqual(neighborIndices)),
      behavior: 'super',
    };
    dispatch(updateTile(neighborTile));
    expect(getState().tiles.find(({ indices }) => indices.isEqual(neighborIndices))).toBe(
      neighborTile
    );
  });

  test("super tile destroys the whole row and column, and also destroys other super tiles if they're affected", () => {
    const { tiles } = getState();
    const superTile = tiles.find(({ indices }) => indices.isEqual(centerIndices));
    expect(superTile).toBeTruthy();

    const neighbors = [{ tile: superTile, recursive: true }];
    let id = 0;

    do {
      const { tile, recursive } = neighbors[id];
      const behavior = tileBehavior[tile.behavior];
      if (!recursive) {
        id += 1;
        continue;
      }

      behavior.indices.forEach((index) => {
        for (let x = 1; x <= behavior.radius.x; x += 1) {
          for (let y = 1; y <= behavior.radius.y; y += 1) {
            const neighbor = tiles.find(
              ({ indices }) =>
                indices &&
                indices.isEqual(Vector.add(tile.indices, Vector.mult(index, new Vector(x, y))))
            );

            if (!neighbor) return;

            if (!neighbors.find(({ tile: t }) => t.indices.isEqual(neighbor.indices)))
              neighbors.push({ tile: neighbor, recursive: neighbor.behavior === 'super' });
          }
        }
      });

      id += 1;
    } while (neighbors[id]);

    expect(neighbors).toHaveLength(settings.size.x * 2 + settings.size.y - 2);
    dispatch(destroyTiles(superTile));
    expect(getState().tiles.filter(({ toDestroy }) => toDestroy)).toHaveLength(neighbors.length);
    dispatch(refillBoard({ pos, dim }));
    expect(getState().tiles.filter(({ toDestroy }) => toDestroy)).toHaveLength(0);
  });

  test('bomb booster destroys tiles in R radius', () => {
    dispatch(createTiles(pos, dim));

    dispatch(
      updateTile({
        ...getState().tiles.find(({ indices }) => indices.isEqual(centerIndices)),
        behavior: 'bomb',
      })
    );

    let { tiles } = getState();

    const tile = tiles.find(({ indices }) => indices.isEqual(centerIndices));
    expect(tile).toBeTruthy();

    const neighbors = [];
    const behavior = tileBehavior.bomb;

    behavior.indices.forEach((index) => {
      for (let x = 1; x <= behavior.radius.x; x += 1) {
        for (let y = 1; y <= behavior.radius.y; y += 1) {
          const neighbor = tiles.find(
            ({ indices }) =>
              indices &&
              indices.isEqual(Vector.add(tile.indices, Vector.mult(index, new Vector(x, y))))
          );

          if (!neighbor) return;

          if (!neighbors.find((t) => t.indices.isEqual(neighbor.indices))) neighbors.push(neighbor);
        }
      }
    });

    expect(neighbors.length).toBeGreaterThan(0);
    dispatch(destroyTiles(tile));

    tiles = getState().tiles;

    expect(tiles.filter(({ toDestroy }) => toDestroy)).toHaveLength(neighbors.length);
  });
});
