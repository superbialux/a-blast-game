import Vector from '../Math/Vector';

const types = ['blue', 'green', 'purple', 'yellow', 'red'];

const settings = {
  aspectRatio: 16 / 10,
  fps: 60,
  size: new Vector(5, 5),
  superTileThreshold: 3, // if destroyed more than x, activate super tile
  minTiles: 2, // if surrounding tiles of the same type is less than 2 then do nothing
  winScore: 100,
  moves: 25,
  color: '#001d3b',
  // Animation Time (in frames)
  refillBoardDuration: 10,
  destroyTileDuration: 10,
  transformToBombDuration: 5,
  teleportDuration: 5,
};

export { types, settings };
