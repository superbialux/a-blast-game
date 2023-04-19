import Vector from '../Math/Vector';
import { getState } from '../store';
import View from './View';

class Overlay extends View {
  render() {
    if (getState().runOnClick) {
      this.ctx.globalAlpha = 0.8;
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
      this.ctx.globalAlpha = 1.0;
      this.addText(
        'ВЫБЕРИТЕ',
        2,
        Vector.add(this.pos, Vector.mult(this.dim, new Vector(0.8, 0.45)))
      );
      this.addText('КЛЕТКУ', 2, Vector.add(this.pos, Vector.mult(this.dim, new Vector(0.8, 0.55))));
    }
  }
}

export default Overlay;
