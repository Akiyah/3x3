export class Tile {
  constructor(x, y, n, status = null) {
    this.x = x;
    this.y = y;
    this.n = n;
    this.status = status;
  }

  toString() {
    if (this.status) {
      return this.x + "," + this.y + "," + this.n + "," + this.status;
    }
    return this.x + "," + this.y + "," + this.n;
  }

  rotate(m = 1) {
    m = (m + 4) % 4;

    if (m > 1) {
      return this.rotate().rotate(m - 1);
    }

    if (m == 1) {
      const x = this.y;
      const y = 3 - this.x;
      return new Tile(x, y, this.n, this.status);
    }

    return this; // m == 0
  }
}
