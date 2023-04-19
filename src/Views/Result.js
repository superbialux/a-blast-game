import Vector from '../Math/Vector';
import { getState } from '../store';
import { settings } from '../util/constants';
import View from './View';

class Result extends View {
  constructor(ctx, pos, dim) {
    super(ctx, pos, dim);

    this.button = null;
    this.score = getState().score;
  }

  preload() {
    this.button = this.assets.button;
  }

  getWinOrLoss() {
    if (this.score >= settings.winScore) return 'Вы выиграли';
    return 'Вы проиграли';
  }

  update() {
    this.score = getState().score;
  }

  render() {
    const pos1 = Vector.add(this.pos, Vector.mult(this.dim, new Vector(0.5, 0.25)));
    this.addText(this.getWinOrLoss(), 7, pos1);

    const pos2 = Vector.add(this.pos, Vector.mult(this.dim, new Vector(0.5, 0.45)));
    this.addText(`Ваш счет: ${getState().score}`, 5, pos2);

    let buttonDim = new Vector(this.dim.x * 0.8, this.dim.y * 0.2);
    if (this.active) buttonDim = Vector.mult(buttonDim, 1.05);
    const buttonPos = Vector.add(this.pos, Vector.sub(this.dim, buttonDim).div(2)).mult(
      new Vector(1, 1.2)
    );
    this.ctx.drawImage(this.button, buttonPos.x, buttonPos.y, buttonDim.x, buttonDim.y);
    this.addText(
      'Играть снова',
      (buttonDim.x + buttonDim.y) * 0.008,
      Vector.add(buttonPos, Vector.div(buttonDim, 2))
    );
  }

  handleClick() {
    window.location.reload();
  }
}

export default Result;
