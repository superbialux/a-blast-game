class Boosters extends View {
  constructor(ctx, pos, dim) {
    super(ctx, pos, dim);

    this.bgImg;
    this.scoreImg;
    this.movesImg;
  }

  preload() {
    this.bgImg = this.assets.find((a) => a.name === "scoreBox").src;
    this.scoreImg = this.assets.find((a) => a.name === "score").src;
    this.movesImg = this.assets.find((a) => a.name === "moves").src;
  }

  addText(title, pos) {
    this.ctx.textAlign = "center";  
    this.ctx.font = "48px serif";

    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(title, pos.x, pos.y);
  }

  renderMoves() {
    const dim = Vector.mult(this.dim, 0.6);
    const pos = Vector.sub(
      Vector.add(this.pos, Vector.div(this.dim, 2)),
      Vector.mult(dim, new Vector(0.5, 0.83))
    );

    this.ctx.drawImage(this.movesImg, pos.x, pos.y, dim.x, dim.y);

    this.addText(getState().moves, pos.add(dim.mult(new Vector(0.5, 0.55))));
  }

  renderScore() {
    const dim = Vector.mult(this.dim, new Vector(0.7, 0.35));
    const pos = Vector.sub(
      Vector.add(this.pos, Vector.div(this.dim, 2)),
      Vector.mult(dim, new Vector(0.5, -0.15))
    );

    this.ctx.drawImage(this.scoreImg, pos.x, pos.y, dim.x, dim.y);
      
    this.addText(getState().score, pos.add(dim.mult(new Vector(0.5, 0.6))));
  }

  renderBG() {
    this.ctx.drawImage(
      this.bgImg,
      this.pos.x,
      this.pos.y,
      this.dim.x,
      this.dim.y
    );
  }

  render() {
    this.renderBG();
    this.renderMoves();
    this.renderScore();
  }
}

export default Boosters;
