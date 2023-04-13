import "normalize.css";
import "./index.css";
import Vector from "./Math/Vector";
import BoardController from "./Components/Board/BoardController";
import TileController from "./Components/Tile/TileController";
import { BoardView } from "./Components/Board";
import Scene from "./Scene";
import BlueTile from "./assets/blue.png";
import GreenTile from "./assets/green.png";
import PurpleTile from "./assets/purple.png";
import YellowTile from "./assets/yellow.png";
import RedTile from "./assets/red.png";

const container = document.createElement("div");
container.classList.add("container");

// Generate Canvas
const smallerSide = Math.min(window.innerWidth, window.innerHeight); // Square resolution on any screen
const res = new Vector(smallerSide, smallerSide);
const canvas = document.createElement("canvas");
canvas.width = res.x;
canvas.height = res.y;

// DOM Manipulation
document.body.appendChild(container);
container.prepend(canvas);

// Generate State
const size = new Vector(5, 5); // Setting: Board Size

let state = {
  mousePos: new Vector(0, 0),
  tiles: Array.from({ length: size.x }, (_, x) =>
    Array.from(
      { length: size.y },
      (_, y) => new TileController(new Vector(x, y))
    )
  ),
};

canvas.addEventListener(
  "mousemove",
  (e) => {
    state.mousePos.x = e.offsetX;
    state.mousePos.y = e.offsetY;
  },
  false
);

// Probably renderer
const ctx = canvas.getContext("2d");
const board = new BoardView(ctx, new Vector(0, 0), res, size);

const game = new Scene(
  [board],
  [
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
  ]
);

canvas.addEventListener(
  "click",
  (e) => {
    const view = game.detectClick(new Vector(e.offsetX, e.offsetY));
    if (view) view.handleClick();
  },
  false
);

const fps = 5;

const render = () => {
  game.clear();
  game.render(state.mousePos);

  setTimeout(() => {
    //requestAnimationFrame(render);
  }, 1000 / fps);
};

(async () => {
  await game.preload();
  game.update(state);

  render();
})();
