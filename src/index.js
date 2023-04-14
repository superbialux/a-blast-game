import "normalize.css";
import "./index.css";
import Vector from "./Math/Vector";
import BoardController from "./Controllers/BoardController";
import TileController from "./Controllers/TileController";
import BoardView from "./Views/BoardView";

import Scene from "./Scene";
import BlueTile from "./assets/blue.png";
import GreenTile from "./assets/green.png";
import PurpleTile from "./assets/purple.png";
import YellowTile from "./assets/yellow.png";
import RedTile from "./assets/red.png";
import TileView from "./Views/TileView";
import AnimationController from "./Controllers/AnimationController";

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
const ctx = canvas.getContext("2d");

const size = new Vector(8, 8); // Setting: Board Size
const board = new BoardView(ctx, new Vector(0, 0), Vector.div(res, 2), size);

const state = {
  animationQueue: [],
  mousePos: new Vector(0, 0),
  moves: 20,
  actions: [],
  dispatch: (action) => state.actions.push(action),
  tiles: Array.from({ length: size.x }, (_, x) =>
    Array.from({ length: size.y }, (_, y) => {
      const indices = new Vector(x, y);
      const type = TileController.createTile();
      const tileSize = Vector.div(board.dim, size);
      const pos = Vector.mult(indices, tileSize).add(board.pos);

      return new TileView(ctx, pos, tileSize, indices, type);
    })
  ),
};

// Probably renderer
const game = new Scene(
  [board, ...state.tiles.flat()],
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
    game.manageEvent("handleClick", new Vector(e.offsetX, e.offsetY), state);
  },
  false
);

canvas.addEventListener(
  "mousemove",
  (e) => {
    game.manageEvent("handleHover", new Vector(e.offsetX, e.offsetY), state);
  },
  false
);

const fps = 5;

const actions = {
  board: BoardController,
  animation: AnimationController,
};

const render = () => {
  game.clear();
  game.render();

  for (const action of state.actions) {
    if (action && !action.initiated) {
      action.initiated = true;
      actions[action.type][action.name](state, action.params);
    }
  }

  for (const anim of state.animationQueue) {
    anim(state.frame);
  }

  setTimeout(() => {
    requestAnimationFrame(render);
  }, 1000 / fps);
};

(async () => {
  await game.preload();

  render();
})();
