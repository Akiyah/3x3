export class Quality {
  constructor() {
    this.map = {};
  }

  m(board) {
    const state = board.toString();
    if (!this.map[state]) {
      this.map[state] = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      board.actions().forEach(([x, y]) => {
        this.map[state][y][x] = 0;
      });
    }
    return this.map[state];
  }

  get(board, action) {
    const [x, y] = action;
    return this.m(board)[y][x];
  }

  set(board, action, value) {
    const [x, y] = action;
    this.m(board)[y][x] = value;
  }

  value(board) {
    const actions = board.actions();
    if (actions.length == 0) {
      return 0;
    }
    const vs = board.actions().map((action) => {
      return this.get(board, action);
    });
    return Math.max(...vs);
  }

  policy(board) {
    const max = this.value(board);
    return board.actions().filter((action) => {
      return this.get(board, action) === max;
    }).shift();
  }
}
