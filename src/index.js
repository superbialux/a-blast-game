import "normalize.css";
import "./index.css";
import Vector from "./Math/Vector";
import BoardController from "./Components/Board/BoardController";
import TileController from "./Components/Tile/TileController";
import { BoardView } from "./Components/Board";

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
    state.mousePos.y = e.offsetY
  },
  false
);

// Probably renderer
const ctx = canvas.getContext("2d");
const board = new BoardView(ctx, new Vector(0, 0), Vector.div(res, 2), size);

const fps = 5;

const render = () => {
  board.clear();
  board.update(state.tiles.flat());
  board.render(state.mousePos);


  setTimeout(() => {
    requestAnimationFrame(render);
  }, 1000 / fps);
};

(async () => {
  await board.preload();
  render();
})();
