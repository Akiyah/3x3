export class Board {
  constructor(marks = this.mapPoints(() => "_")) {
    this.marks = marks;
  }

  toString() {
    return this.marks.map(row =>
      row.map(mark => mark).join("")
    ).join("\n");
  }

  mapPoints(callback) {
    return [0, 1, 2].map(y => [0, 1, 2].map(x => callback([x, y])));
  }

  mark([x, y]) {
    return this.marks[y][x];
  }

  step(action) {
    const [x, y] = action;
    const k = 9 - this.actions().length;
    const mark = ((k % 2 == 0) ? 'o' : 'x');

    let marks = this.mapPoints((action0) => this.mark(action0));
    marks[y][x] = mark;
    return new Board(marks);
  }

  enable(action) {
    return this.mark(action) === "_";
  }

  actions() {
    return this.mapPoints((action) => this.enable(action) ? action : null).flat().filter(p => p);
  }

  randomAction() {
    const actions = this.actions();
    const i = this.random(actions.length);
    return actions[i];
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
      line.every((action) => this.mark(action) == mark)
    );
  }

  winner() {
    if (this.isWin("o")) {
      return "o";
    }

    if (this.isWin("x")) {
      return "x";
    }

    if (this.actions().length == 0) {
      return "-";
    }

    return null;
  }
}
