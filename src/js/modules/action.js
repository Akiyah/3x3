export class Action {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static create(string) {
    const m = string.match(/^\[(\d+), (\d+)\]$/);
    return new Action(Number(m[1]), Number(m[2]));
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }
}
