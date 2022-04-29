import { Action } from "./action.js";

export class State {
  constructor(marks = this.mapPoints(() => " ")) {
    this.marks = marks;
  }

  toString() {
    return this.marks.map(row =>
      row.map(mark => mark).join("")
    ).join("\n");
  }

  mapPoints(callback) {
    return [0, 1, 2].map(y => [0, 1, 2].map(x => callback(new Action(x, y))));
  }

  mark(action) {
    const x = action.x;
    const y = action.y;
    return this.marks[y][x];
  }

  nextPlayerIndex() {
    return (this.actions().length % 2 == 0) ? 1 : 0;
  }

  nextPlayerMark() {
    return (this.nextPlayerIndex() == 0) ? 'o' : 'x';
  }

  step(action) {
    const x = action.x;
    const y = action.y;

    let marks = this.mapPoints((action0) => this.mark(action0));
    marks[y][x] = this.nextPlayerMark();
    return new State(marks);
  }

  enable(action) {
    return this.mark(action) === " ";
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
    lines = lines.concat(this.mapPoints((action) => new Action(action.y, action.x))); // |
    lines = lines.concat(this.mapPoints((action) => new Action(action.x, action.y))); // -
    lines = lines.concat([[0, 1, 2].map(i => new Action(i, i))]); // \
    lines = lines.concat([[0, 1, 2].map(i => new Action(i, 2 - i))]); // /
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

  reward() {
    if (this.isWin("o")) {
      return 1;
    }

    if (this.isWin("x")) {
      return -1;
    }

    return 0;
  }
}
