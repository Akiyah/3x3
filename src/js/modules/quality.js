const α = 0.2;
const γ = 1;

export class Quality {
  constructor() {
    this.table = {};
    this.trainCount = 0;
  }

  m(state) {
    const s = state.toString();
    if (!this.table[s]) {
      this.table[s] = {};
    }
    return this.table[s];
  }

  get(state, action) {
    const d = this.m(state)[action.toString()];
    return d ? d.q : 0;
  }

  updateCount(state, action) {
    const d = this.m(state)[action.toString()];
    return d ? d.updateCount : 0;
  }

  set(state, action, q) {
    let d = this.m(state)[action.toString()];
    d ||= { q: 0, updateCount: 0 };
    d.q = q;
    d.updateCount++;
    this.m(state)[action.toString()] = d;
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

  findAction(state, epsilon) {
    if (Math.random() < epsilon) {
      return state.randomAction();
    } else {
      return this.policy(state);
    }
  }

  trainEvent(state0, action0, state1, reward) {
    let q0 = this.get(state0, action0);
    const q1 = this.value(state1);
    q0 = q0 + α * (reward + γ * q1 - q0);
    this.set(state0, action0, q0);
  }

  train(episode) {
    episode.eachStep((event0, event1) => {
      this.trainEvent(event0.state, event0.action, event1.state, event1.reward);
    });
    this.trainCount++;
  }

  qTableCount() {
    return Object.entries(this.table).reduce((sum, [_stateString, qs]) => {
      return sum + Object.entries(qs).length;
    }, 0);
  }
}
