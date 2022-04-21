export class Board {
  constructor(marks = this.mapPoints(() => "_")) {
    this.marks = marks;
  }

  static create(state) {
    const marks = state.split("\n").map(row => {
      return row.split("");
    });
    return new Board(marks);
  }

  state() {
    return this.marks.map(row =>
      row.map(mark => mark).join("")
    ).join("\n");
  }

  mapPoints(callback) {
    return [0, 1, 2].map(y => [0, 1, 2].map(x => callback([x, y])));
  }

  mark(x, y) {
    return this.marks[y][x];
  }

  step(action) {
    const [x, y] = action;
    const k = 9 - this.actions().length;
    const mark = ((k % 2 == 0) ? 'o' : 'x');

    let marks = this.mapPoints(([x0, y0]) => this.mark(x0, y0));
    marks[y][x] = mark;
    return new Board(marks);
  }

  isBlank(x, y) {
    return this.mark(x, y) === "_";
  }

  actions() {
    return this.mapPoints(([x, y]) => this.isBlank(x, y) ? [x, y] : null).flat().filter(p => p);
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
      line.every(([x, y]) => this.mark(x, y) == mark)
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
