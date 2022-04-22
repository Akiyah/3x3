export class Quality {
  constructor() {
    this.map = {};
  }

  m(board) {
    const s = board.toString();
    if (!this.map[s]) {
      this.map[s] = {};
      board.actions().forEach((action) => {
        this.map[s][action.toString()] = 0;
      });
    }
    return this.map[s];
  }

  get(board, action) {
    return this.m(board)[action.toString()];
  }

  set(board, action, value) {
    this.m(board)[action.toString()] = value;
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
