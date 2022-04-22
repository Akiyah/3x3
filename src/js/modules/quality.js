export class Quality {
  constructor() {
    this.map = {};
  }

  m(state) {
    const s = state.toString();
    if (!this.map[s]) {
      this.map[s] = {};
      state.actions().forEach((action) => {
        this.map[s][action.toString()] = 0;
      });
    }
    return this.map[s];
  }

  get(state, action) {
    return this.m(state)[action.toString()];
  }

  set(state, action, value) {
    this.m(state)[action.toString()] = value;
  }

  value(state) {
    const actions = state.actions();
    if (actions.length == 0) {
      return 0;
    }
    const vs = state.actions().map((action) => {
      return this.get(state, action);
    });
    return Math.max(...vs);
  }

  policy(state) {
    const max = this.value(state);
    return state.actions().filter((action) => {
      return this.get(state, action) === max;
    }).shift();
  }
}
