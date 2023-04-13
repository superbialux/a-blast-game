import Vector from "../../Math/Vector";

class TileView {
  constructor(ctx, img, pos, size) {
    this.ctx = ctx;
    this.img = img;
    this.pos = pos;
    this.size = size;

    this.boundaryMin = pos.copy()
    this.boundaryMax = Vector.add(pos, size);
  }

  render(active = false) {
    let size = this.size.copy().mult(0.98);
    let pos = this.pos.copy().add(Vector.sub(this.size, size).div(2));
    if (active) {
      size = this.size;
      pos = this.pos;
    }
    this.ctx.drawImage(this.img, pos.x, pos.y, size.x, size.y);
  }
}

export default TileView;
