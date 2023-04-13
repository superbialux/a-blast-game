class BoardController {
  static shuffle(tiles) {
    for (let i = tiles.length - 1; i > 0; i--) {
      for (let j = tiles[i].length - 1; j > 0; j--) {
        const i1 = Math.floor(Math.random() * (i + 1));
        const j1 = Math.floor(Math.random() * (j + 1));

        [tiles[i][j].indices, tiles[i1][j1].indices] = [tiles[i1][j1].indices, tiles[i][j].indices];
      }
    }
  }

  static clear() {}
}

export default BoardController;
