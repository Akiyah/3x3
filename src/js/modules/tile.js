export class Tile {
  constructor(x, y, mark = " ") {
    this.x = x;
    this.y = y;
    this.mark = mark;
  }

  isBlank() {
    return this.mark === " ";
  }
}
