import Vector from '../Math/Vector';

const types = ['blue', 'green', 'purple', 'yellow', 'red'];

const settings = {
  aspectRatio: 16 / 10,
  fps: 30,
  size: new Vector(5, 5),
  superTileThreshold: 3, // if destroyed more than x, activate super tile
  minTiles: 2, // if surrounding tiles of the same type is less than 2 then do nothing

  // Animation Time (in frames)
  refillBoardDuration: 10,
  destroyTileDuration: 10,
  transformToBombDuration: 5,
};

export { types, settings };
