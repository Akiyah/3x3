export class Board {
  constructor(marks = this.mapPoints(() => "_")) {
    this.marks = marks;
  }

  static create(key) {
    const marks = key.split("\n").map(row => {
      return row.split("");
    });
    return new Board(marks);
  }

  key() {
    return this.marks.map(row =>
      row.map(mark => mark).join("")
    ).join("\n");
  }

  mapPoints(callback) {
    return [0, 1, 2].map(y => [0, 1, 2].map(x => callback(x, y)));
  }

  mark(x, y) {
    return this.marks[y][x];
  }

  step(x, y) {
    const k = 9 - this.blankPoints().length;
    const mark = ((k % 2 == 0) ? 'o' : 'x');

    let marks = this.mapPoints((x0, y0) => this.mark(x0, y0));
    marks[y][x] = mark;
    return new Board(marks);
  }

  isBlank(x, y) {
    return this.mark(x, y) === "_";
  }

  blankPoints() {
    return this.mapPoints((x, y) => this.isBlank(x, y) ? [x, y] : null).flat().filter(p => p);
  }

  random(n) {
    return Math.floor(Math.random() * n);
  }

  lines() {
    let lines = [];
    lines = lines.concat([0, 1, 2].map(x => [0, 1, 2].map(y => [x, y]))); // |
    lines = lines.concat([0, 1, 2].map(y => [0, 1, 2].map(x => [x, y]))); // -
    lines = lines.concat([[0, 1, 2].map(i => [i, i])]); // \
    lines = lines.concat([[0, 1, 2].map(i => [i, 2 - i])]); // /
    return lines;
  }

  isWin(mark) {
    return this.lines().some(line =>
      line.every(([x, y]) => this.mark(x, y) == mark)
    );
  }

  status() {
    if (this.isWin("o")) {
      return "o win";
    }

    if (this.isWin("x")) {
      return "x win";
    }

    if (this.blankPoints() == 0) {
      return "draw";
    }

    return "";
  }

  reword() {
    if (this.isWin("o")) {
      return 1;
    }

    if (this.isWin("x")) {
      return -1;
    }

    if (this.blankPoints() == 0) {
      return 0;
    }

    return null;
  }
}
