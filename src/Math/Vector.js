class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.mag();
    if (len !== 0) this.mult(1 / len);
    return this;
  }

  dot(x, y) {
    if (x instanceof Vector) {
      return this.dot(x.x, x.y);
    }
    return this.x * (x || 0) + this.y * (y || 0);
  }

  add(v) {
    this.x += v.x || 0;
    this.y += v.y || 0;
    return this;
  }

  static add(v1, v2) {
    const newV = v1.copy();
    newV.x += v2.x;
    newV.y += v2.y;
    return newV;
  }

  sub(v) {
    this.x -= v.x || 0;
    this.y -= v.y || 0;

    return this;
  }

  static sub(v1, v2) {
    const newV = v1.copy();

    newV.x -= v2.x;
    newV.y -= v2.y;
    return newV;
  }

  mult(x) {
    if (x instanceof Vector) {
      this.x *= x.x;
      this.y *= x.y;
      return this;
    }

    this.x *= x;
    this.y *= x;
    return this;
  }

  static mult(v1, v2) {
    const newV = v1.copy();
    if (v2 instanceof Vector) {
      newV.x *= v2.x;
      newV.y *= v2.y;
      return newV;
    }

    newV.x *= v2;
    newV.y *= v2;
    return newV;
  }

  div(x) {
    if (x instanceof Vector) {
      if (x.x === 0 || x.y === 0) {
        console.warn("Math/Vectors", "Cannot divide by 0");
        return this;
      }
      this.x /= x.x;
      this.y /= x.y;
      return this;
    }
    if (x === 0) {
      console.warn("Math/Vectors", "Cannot divide by 0");
      return this;
    }
    this.x /= x;
    this.y /= x;
    return this;
  }

  static div(v1, v2) {
    const newV = v1.copy();
    if (v2 instanceof Vector) {
      if (v2.x === 0 || v2.y === 0) {
        console.warn("Math/Vectors", "Cannot divide by 0");
        return this;
      }
      newV.x /= v2.x;
      newV.y /= v2.y;
      return newV;
    }
    if (v2 === 0) {
      console.warn("Math/Vectors", "Cannot divide by 0");
      return this;
    }
    newV.x /= v2;
    newV.y /= v2;
    return newV;
  }

  pow(x) {
    if (x instanceof Vector) {
      this.x **= x.x;
      this.y **= x.y;
      return this;
    }

    this.x **= x;
    this.y **= x;
    return this;
  }
}

export default Vector;