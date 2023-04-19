import Vector from '../Math/Vector';

const types = ['blue', 'green', 'purple', 'yellow', 'red'];

const settings = {
  aspectRatio: 16 / 10,
  fps: 30,
  size: new Vector(5, 5),
  superTileThreshold: 3, // if destroyed more than x, activate super tile
  minTiles: 2, // if surrounding tiles of the same type is less than 2 then do nothing

  // Animation Time (in frames)
  refillBoardDuration: 6,
  destroyTileDuration: 6,
  transformToBombDuration: 3,
  teleportDuration: 3,
  shuffleDuration: 3,
};

export { types, settings };
