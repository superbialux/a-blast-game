import BlueTile from "../assets/blue.png";
import GreenTile from "../assets/green.png";
import PurpleTile from "../assets/purple.png";
import YellowTile from "../assets/yellow.png";
import RedTile from "../assets/red.png";
import SuperTile from "../assets/super.png";
import BoardBG from "../assets/board.png";

import ScoreBox from "../assets/scoreBox.png";
import Score from "../assets/score.png";
import Moves from "../assets/moves.png";
import Vector from "../Math/Vector";
import BoardView from "../Views/Board";

const scenesSchema = [
  {
    name: "game",
    views: [
      {
        name: "board",
        component: BoardView,
        pos: new Vector(0.05, 0.05), // in the range from 0 to 1 where 0.5 is the center of the screen;
        dim: new Vector(0.5, 0.5), // in the rnage from 0 to 1, relation to the resolution's bigger side
      },
    ],
    assets: [
      {
        name: "scoreBox",
        src: ScoreBox,
      },
      {
        name: "score",
        src: Score,
      },
      {
        name: "moves",
        src: Moves,
      },
      { name: "board", src: BoardBG },
      {
        name: "super",
        src: SuperTile,
      },
      {
        name: "blue",
        src: BlueTile,
      },
      {
        name: "green",
        src: GreenTile,
      },
      {
        name: "purple",
        src: PurpleTile,
      },
      {
        name: "yellow",
        src: YellowTile,
      },
      {
        name: "red",
        src: RedTile,
      },
    ],
  },
];

const finishAssets = [
  {
    name: "scoreBox",
    src: ScoreBox,
  },
  {
    name: "score",
    src: Score,
  },
  {
    name: "moves",
    src: Moves,
  },
];

export { scenesSchema };
