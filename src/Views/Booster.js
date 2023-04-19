import Vector from '../Math/Vector';
import { getState } from '../store';
import View from './View';

class Booster extends View {
  constructor(ctx, pos, dim, { name, title }) {
    super(ctx, pos, dim);

    this.bg = null;
    this.img = null;
    this.booster = null;
    this.name = name;
    this.title = title;
  }

  preload() {
    this.bg = this.assets.booster;
    this.img = this.assets[this.name];
  }

  update() {
    this.booster = getState().boosters[this.name];
  }

  render() {
    this.ctx.drawImage(this.bg, this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    const imgDim = Vector.mult(this.dim, 0.65);
    const imgPos = Vector.add(this.pos, Vector.div(Vector.sub(this.dim, imgDim), 2));
    this.ctx.drawImage(this.img, imgPos.x, imgPos.y * 0.99, imgDim.x, imgDim.y);
    this.addText(
      `${this.title} (${this.booster.count})`,
      4.5,
      Vector.add(this.pos, Vector.div(this.dim, 2)).add(new Vector(0, imgDim.y * 0.85))
    );
  }

  handleClick() {
    this.booster.action();
  }
}

export default Booster;
