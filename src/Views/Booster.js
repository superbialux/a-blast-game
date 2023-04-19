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
    let { dim, pos } = this;
    if (this.active) {
      dim = Vector.mult(this.dim, 1.05);
      pos = Vector.add(this.pos, Vector.sub(this.dim, dim).div(2));
    }
    this.ctx.drawImage(this.bg, pos.x, pos.y, dim.x, dim.y);
    const imgDim = Vector.mult(dim, 0.65);
    const imgPos = Vector.add(pos, Vector.div(Vector.sub(dim, imgDim), 2));
    this.ctx.drawImage(this.img, imgPos.x, imgPos.y * 0.99, imgDim.x, imgDim.y);
    this.addText(
      `${this.title} (${this.booster.count})`,
      4.5,
      Vector.add(pos, Vector.div(dim, 2)).add(new Vector(0, imgDim.y * 0.85)),
      this.booster.count === 0 ? '#d11f31' : '#fff'
    );
  }

  handleClick() {
    this.booster.action();
  }
}

export default Booster;
