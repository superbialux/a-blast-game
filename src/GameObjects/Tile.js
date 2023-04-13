import types from "../util/constants";
import randEl from "../util/number";

class Tile {
  constructor(indices) {
    this.indices = indices;

    const typeEl = randEl(types);
    this.type = typeEl.name;
    this.img = typeEl.img;
  }
}

export default Tile;
