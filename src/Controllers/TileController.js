import { types } from "../util/constants";
import randEl from "../util/number";

class TileController {
  static createTile() {
    return randEl(types)
  }
}

export default TileController;
