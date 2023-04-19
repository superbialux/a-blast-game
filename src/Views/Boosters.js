import Vector from '../Math/Vector';
import View from './View';

class Boosters extends View {
  constructor(ctx, pos, dim) {
    super(ctx, pos, dim);

    this.bg = null;
  }

  preload() {
    this.bg = this.assets.booster;
  }

  render() {
    this.addText('БУСТЕРЫ', 4, Vector.add(this.pos, new Vector(this.dim.y / 2, 1.0)));
  }
}

export default Boosters;
