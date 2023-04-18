import Vector from '../Math/Vector';

const types = ['blue', 'green', 'purple', 'yellow', 'red'];

const settings = {
  aspectRatio: 16 / 10,
  fps: 30,
  size: new Vector(2, 2),
  superTileThreshold: 3, // if destroyed more than x, activate super tile
  minTiles: 3, // if surrounding tiles of the same type is less than 2 then do nothing
};

export { types, settings };
