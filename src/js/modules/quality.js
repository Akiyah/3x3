import { Board } from './board.js';

export class Quality {
  constructor() {
    this.map = {};
  }

  m(board) {
    const state = board.state();
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

  policy(board) {
    const vas = board.actions().map((action) => {
      return { value: this.get(board, action), action: action };
    });
    const max = Math.max(...vas.map((va) => va.value));
    return vas.filter((va) => {
      return va.value === max;
    }).shift().action;
  }
}
