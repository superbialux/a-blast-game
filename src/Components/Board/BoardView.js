import Vector from "../../Math/Vector";
import { typeToImgMapping } from "../../util/constants";
import BlueTile from "../../assets/blue.png";
import GreenTile from "../../assets/green.png";
import PurpleTile from "../../assets/purple.png";
import YellowTile from "../../assets/yellow.png";
import RedTile from "../../assets/red.png";
import { TileView } from "../Tile";

class BoardView {
  constructor(ctx, pos, dim, size) {
    this.ctx = ctx;
    this.pos = pos;
    this.dim = dim;

    this.tileSize = Vector.div(dim, size);
    this.assets = {
      blue: BlueTile,
      green: GreenTile,
      purple: PurpleTile,
      yellow: YellowTile,
      red: RedTile,
    };

    this.tiles = []
  }

  update(tiles) {
    const views = [];

    for (const tile of tiles) {
      const pos = Vector.mult(tile.indices, this.tileSize).add(this.pos);

      const img = this.assets[tile.type];
      const size = this.tileSize.copy();

      views.push(new TileView(this.ctx, img, pos, size));
    }

    this.tiles = views;
  }

  preload() {
    const promises = [];
    for (const key in this.assets) {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.assets[key] = img;
          resolve();
        };
        img.onerror = reject;
        img.src = this.assets[key];
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  render(mousePos) {
    let highlightedTileIndex = -1; // Index of the tile to be drawn above all other elements, set to -1 initially
    for (let i in this.tiles) {
      const tile = this.tiles[i];
      if (
        mousePos.x > tile.boundaryMin.x &&
        mousePos.x < tile.boundaryMax.x &&
        mousePos.y > tile.boundaryMin.y &&
        mousePos.y < tile.boundaryMax.y
      ) {
        highlightedTileIndex = i; // Update the highlighted tile index
        tile.hovered = true;
      } else {
        tile.render();
      }
    }

    // Draw the highlighted tile above all other elements
    if (highlightedTileIndex !== -1) {
      const highlightedTile = this.tiles[highlightedTileIndex];
      highlightedTile.render(true);
    }
  }

  clear() {
    this.ctx.clearRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }
}

export default BoardView;
