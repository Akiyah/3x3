import { ThreeState } from "./three_state.js";

export class ThreeSolver {
  init() {
    const data = {};

    this.each((state) => {
      const key = state.toString();
      if (!data[key]) {
        data[key] = state.reward();
      }
    });

    return data;
  }

  each(callback) {
    const state = new ThreeState();
    this.eachOne(state, 0, callback);
  }

  eachOne(state, depth, callback) {
    callback(state);

    if (state.reward() != 0) {
      return;
    }

    if (7 <= depth) {
      return;
    }

    state.actions().forEach((action) => {
      this.eachOne(state.step(action), depth + 1, callback);
    });
  }
}
