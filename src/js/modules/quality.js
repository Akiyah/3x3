export class Quality {
  constructor() {
    this.map = {};
  }

  m(state) {
    const s = state.toString();
    if (!this.map[s]) {
      this.map[s] = {};
    }
    return this.map[s];
  }

  get(state, action) {
    const q = this.m(state)[action.toString()];
    return q ? q : 0;
  }

  set(state, action, q) {
    this.m(state)[action.toString()] = q;
  }

  value(state) {
    const actions = state.actions();
    if (actions.length == 0) {
      return 0;
    }
    const qs = state.actions().map((action) => {
      return this.get(state, action);
    });
    return Math.max(...qs);
  }

  policy(state) {
    const qMax = this.value(state);
    return state.actions().filter((action) => {
      return this.get(state, action) === qMax;
    }).shift();
  }
}
