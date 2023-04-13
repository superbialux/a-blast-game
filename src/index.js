import "normalize.css";
import "./index.css";
import Vector from "./Math/Vector";
import Board from "./GameObjects/Board";
import Tile from "./GameObjects/Tile";
import Game from "./Scenes/Game";

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

// Generate Tiles
const size = new Vector(5, 5); // Setting: Board Size
const tiles = Array.from({ length: size.x }, (_, x) =>
  Array.from({ length: size.y }, (_, y) => new Tile(new Vector(x, y)))
);
const board = new Board(tiles);

// Probably renderer
const ctx = canvas.getContext("2d");

// Scenes
const game = new Game(board);
