import Vector from '../Math/Vector';
import { settings } from './constants';

const tileBehavior = {
  normal: {
    indices: [
      new Vector(0, 0),
      new Vector(0, -1),
      new Vector(1, 0),
      new Vector(0, 1),
      new Vector(-1, 0),
    ],
    radius: new Vector(1, 1),
    checkType: true, // useful for super tiles that, for example, destroy all tiles of type 'red',
    recursive: true, // for example, if super tiles destroys all tiles in R radius than it's not recursive (unless one of the destroyed tiles is a super tile)
  },
  super: {
    indices: [
      new Vector(0, 0),
      new Vector(0, -1),
      new Vector(1, 0),
      new Vector(0, 1),
      new Vector(-1, 0),
    ],
    radius: settings.size, // destroy the whole row and column
    checkType: false,
    recursive: false,
  },
  bomb: {
    indices: [
      new Vector(0, 0),
      new Vector(0, -1),
      new Vector(1, 0),
      new Vector(0, 1),
      new Vector(-1, 0),
      new Vector(1, 1),
      new Vector(-1, -1),
      new Vector(1, -1),
      new Vector(-1, 1),
    ],
    radius: new Vector(1, 1), // destroy tiles around
    checkType: false,
    recursive: false,
  },
};

const isBoardPlayable = (tiles) => {
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

  return pairs.filter((arr) => arr.length >= settings.minTiles).length > 0;
};

const tileDefault = {
  pair: null,
  toDestroy: false,
  behavior: 'normal',
  opacity: 1.0,
};

export { tileDefault, tileBehavior, isBoardPlayable };
