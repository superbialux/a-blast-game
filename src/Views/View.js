import Vector from '../Math/Vector';

class View {
  constructor(ctx, pos, dim, type) {
    this.ctx = ctx;
    this.pos = pos;
    this.dim = dim;
    this.area = dim.x * dim.y;

    this.boundaryMin = pos.copy();
    this.boundaryMax = Vector.add(pos, dim);

    this.assets = [];

    this.viewType = type || 'common-view';
  }

  clear() {
    this.ctx.clearRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }

  render() {
    return this;
  }

  update() {
    return this;
  }

  handleClick() {
    return this;
  }

  handleHover() {
    return this;
  }

  handleMouseLeave() {
    return this;
  }

  preload() {
    return this;
  }

  addText(title, fontSize, pos) {
    this.ctx.textAlign = 'center';
    this.ctx.font = `${fontSize}px Seymour One`;

    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(title, pos.x, pos.y);
  }
}

export default View;
