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

  static normalKeys(board = new Board(), keys = []) {
    const key = board.normalize().key();
    if (keys.includes(key)) {
      return;
    }
    keys.push(key);

    if (board.status() === "") {
      board.blankPoints().map(([x, y]) => {
        const nextBoard = board.step(x, y);
        Board.normalKeys(nextBoard, keys);
      });
    }

    return keys;
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

  markIndex(x, y) {
    const mark = this.mark(x, y);
    if (mark === '_') {
      return 0;
    } else if (mark === 'o') {
      return 1;
    } else {
      return 2;
    }
  }

  step(x, y) {
    const k = 9 - this.blankPoints().length;
    const mark = ((k % 2 == 0) ? 'o' : 'x');

    let marks = this.mapPoints((x0, y0) => this.mark(x0, y0));
    marks[y][x] = mark;
    return new Board(marks);
  }

  index() {
    return this.mapPoints((x, y) => this.markIndex(x, y) * 3 ** (x + 3 * y)).flat().reduce((s, e) => s + e);
  }

  isBlank(x, y) {
    return this.mark(x, y) === "_";
  }

  blankPoints() {
    return this.mapPoints((x, y) => this.isBlank(x, y) ? [x, y] : null).flat().filter(p => p);
  }

  rotate() {
    const marks = this.mapPoints((x, y) => this.mark(y, 2 - x));
    return new Board(marks);
  }

  turn() {
    const marks = this.mapPoints((x, y) => this.mark(2 - x, y));
    return new Board(marks);
  }

  translateBoards() {
    let board = this;
    let boards = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        boards.push(board);
        board = board.rotate();
      }
      board = board.turn();
    }
    return boards;
  }

  normalize() {
    const boards = this.translateBoards();
    const indexes = boards.map(board => board.index());
    const minIndex = Math.min(...indexes);
    return boards.find(board => board.index() === minIndex);
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
