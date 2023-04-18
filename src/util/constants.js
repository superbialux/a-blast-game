import BlueTile from "../assets/blue.png";
import GreenTile from "../assets/green.png";
import PurpleTile from "../assets/purple.png";
import YellowTile from "../assets/yellow.png";
import RedTile from "../assets/red.png";
import Vector from "../Math/Vector";

const types = ["blue", "green", "purple", "yellow", "red"];

const settings = {
  aspectRatio: 16 / 10,
  fps: 30,
  size: new Vector(5, 5),
  superTileThreshold: 3, // if destroyed more than x, activate super tile
  minTiles: 2, // if surrounding tiles of the same type is less than 2 then do nothing
};

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
    radius: new Vector(5, 5), // destroy tiles around
    checkType: false,
    recursive: false,
  },
};

export { types, settings, tileBehavior };
