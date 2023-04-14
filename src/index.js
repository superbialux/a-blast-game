import "normalize.css";
import "./index.css";
import Vector from "./Math/Vector";
import BoardView from "./Views/BoardView";

import Scene from "./Scene";
import BlueTile from "./assets/blue.png";
import GreenTile from "./assets/green.png";
import PurpleTile from "./assets/purple.png";
import YellowTile from "./assets/yellow.png";
import RedTile from "./assets/red.png";
import TileView from "./Views/TileView";
import Renderer from "./Renderer";

import { getState, dispatch } from "./store";
import { createTiles } from "./store/actions";

const renderer = new Renderer(1 / 1, "2d");
const ctx = renderer.init();
const size = new Vector(8, 8); // Setting: Board Size
const board = new BoardView(ctx, new Vector(0, 0), renderer.res, size);

renderer.canvas.addEventListener(
  "click",
  (e) => {
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

const FPS = 5;
const game = new Scene();

const render = () => {
  game.clear();

  game.update();
  game.render();
  
  setTimeout(() => {
    requestAnimationFrame(render);
  }, 1000 / FPS);
};

(async () => {
  dispatch(createTiles(size, board.dim, board.pos));

  const tiles = getState()
    .tiles.flat()
    .map((tile) => new TileView(ctx, tile));
  game.views = [board, ...tiles]; //new Scene(
  game.assets = [
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
  await game.preload();
  render();
})();
