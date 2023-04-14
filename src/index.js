import "normalize.css";
import "./index.css";
import Vector from "./Math/Vector";
import BoardView from "./Views/Board";

import Scene from "./Scene";
import BlueTile from "./assets/blue.png";
import GreenTile from "./assets/green.png";
import PurpleTile from "./assets/purple.png";
import YellowTile from "./assets/yellow.png";
import RedTile from "./assets/red.png";
import TileView from "./Views/Tile";
import Renderer from "./Renderer";
import BoardBG from "./assets/board.png";

import ScoreBox from "./assets/scoreBox.png";
import Score from "./assets/score.png";
import Moves from "./assets/moves.png";

import { getState, dispatch } from "./store";
import { changeScene, createTiles } from "./store/actions";
import Progress from "./Views/Progress";

const renderer = new Renderer(4 / 3, "2d");
const ctx = renderer.init();
const size = new Vector(5, 5);

const smallSide = Math.max(renderer.res.x, renderer.res.y);
const square = new Vector(smallSide, smallSide);
const tileSize = Vector.div(square, size.x + size.y);
const border = smallSide * 0.01;

const boardDim = Vector.mult(size, tileSize);
const boardPos = new Vector(border, boardDim.y * 0.25);
const board = new BoardView(ctx, boardPos, boardDim);

const progressDim = Vector.mult(square, 0.35);
const progress = new Progress(
  ctx,
  new Vector(
    renderer.res.x - progressDim.x - border,
    renderer.res.y * 0.5 - progressDim.y * 0.5
  ),
  progressDim
);

renderer.canvas.addEventListener(
  "click",
  (e) => {
    const animations = getState().animations.filter(
      ({ finished }) => !finished
    );

    if (animations.length > 0) return;

    game.manageEvent("handleClick", new Vector(e.offsetX, e.offsetY));
  },
  false
);

renderer.canvas.addEventListener(
  "mousemove",
  (e) => {
    game.manageEvent("handleHover", new Vector(e.offsetX, e.offsetY));
  },
  false
);

const gameViews = [board, progress];

const gameAssets = [
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
];

const game = new Scene("game", gameViews, gameAssets);
const finish = new Scene(
  "finish",
  [progress],
  [
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
  ]
);

(async () => {
  dispatch(createTiles(size, board.dim, board.pos));
  getState()
    .tiles.map(
      (tile) => new TileView(ctx, tile, board.boundaryMin, board.boundaryMax)
    )
    .forEach((tile) => game.addView(tile));

  await game.preload();
  renderer.addScene(game);
  renderer.addScene(finish);

  renderer.render(() => {
    if (getState().moves === 0) {
      game.clear()
      dispatch(changeScene('finish'))
    }
  }) ;
})();
