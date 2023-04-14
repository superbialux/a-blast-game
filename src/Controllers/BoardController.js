import Vector from "../Math/Vector";
import { types } from "../util/constants";
import randEl from "../util/number";

const indicesToCheck = [
  new Vector(0, 0),
  new Vector(0, -1),
  new Vector(1, 0),
  new Vector(0, 1),
  new Vector(-1, 0),
];

class BoardController {
  static shuffle(tiles) {
    for (let i = tiles.length - 1; i > 0; i--) {
      for (let j = tiles[i].length - 1; j > 0; j--) {
        const i1 = Math.floor(Math.random() * (i + 1));
        const j1 = Math.floor(Math.random() * (j + 1));

        [tiles[i][j].indices, tiles[i1][j1].indices] = [
          tiles[i1][j1].indices,
          tiles[i][j].indices,
        ];
      }
    }
  }

  static destroy(state, tile) {
    const tilesToDestroy = [tile];

    let i = 0;
    while (i < tilesToDestroy.length) {
      for (const index of indicesToCheck) {
        const currentIndices = tilesToDestroy[i].indices;
        const indices = Vector.sub(currentIndices, index);
        const newTile = state.tiles[indices.x]?.[indices.y] ?? false;

        if (
          !newTile ||
          newTile.type !== tile.type ||
          tilesToDestroy.find(({ id }) => id === newTile.id)
        )
          continue;

        tilesToDestroy.push(newTile);
      }
      i++;
    }

    if (tilesToDestroy.length === 1) return;

    this.refill(tilesToDestroy, state);
  }

  static refill(tiles, state) {
    let columns = [];

    // Find out how many in a column was destroyed and the last tile for refilling the board
    tiles.forEach((tile) => {
      const col = columns.find(({ key }) => key === tile.indices.x);
      if (col) {
        if (tile.indices.y > col.lastYIndex) {
          col.lastYIndex = tile.indices.y;
        }
        col.length++;
      } else {
        columns = [
          ...columns,
          { key: tile.indices.x, length: 0, lastYIndex: tile.indices.y },
        ];
      }
    });

    columns.forEach((col) => {
      const skipAbove = col.length + 1;

      const tilesToSwap = state.tiles
        .flat()
        .filter(
          ({ indices }) => indices.x === col.key && indices.y <= col.lastYIndex
        );

      for (let i = tilesToSwap.length - 1; i >= 0; i--) {
        const tile = tilesToSwap[i];
        const swapTile = tilesToSwap.find(
          ({ indices }) =>
            indices.x === tile.indices.x &&
            indices.y === tile.indices.y - skipAbove
        );

        let startPos = Vector.sub(
          tile.pos,
          new Vector(0, skipAbove * tile.dim.y)
        );
        let endPos = tile.pos;

        if (swapTile) {
          tile.swap(swapTile);
          startPos = swapTile.pos;
        } else {
          tile.type = randEl(types);
        }
        tile.preload();
        tile.pos = startPos;

        state.dispatch({
          type: "animation",
          name: "addToQueue",
          params: {
            startVal: tile.pos.copy(),
            endVal: endPos.copy(),
            duration: 10,
            callback: (pos) => (tile.pos = pos),
          },
        });
      }
    });
  }

  static clear() {}
}

export default BoardController;
