import { types } from "../../util/constants";
import randEl from "../../util/number";

class TileController {
  constructor(indices) {
    this.indices = indices;
    this.type = randEl(types);
  }
}

export default TileController;
