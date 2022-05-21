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

  update(data) {
    const newData = {};

    this.each((state) => {
      const key = state.toString();
      if (data[key] != 0) {
        newData[key] = data[key];
        return;
      }

      const values = state.actions().map((action) => {
        const key = state.step(action).toString();
        return data[key];
      });

      const valuesPlus = values.filter((v) => { return 0 < v; });
      const valuesMinus = values.filter((v) => { return v < 0; });

      if (state.nextPlayerMark() == 'o') {
        if (0 < valuesPlus.length) {
          newData[key] = Math.min(...valuesPlus) + 1;
          return;
        }
        if (valuesMinus.length == values.length) {
          newData[key] = Math.max(...valuesMinus) - 1;
          return;
        }
        newData[key] = 0;
      } else {
        if (0 < valuesMinus.length) {
          newData[key] = Math.max(...valuesMinus) - 1;
          return;
        }
        if (valuesPlus.length == values.length) {
          newData[key] = Math.min(...valuesPlus) + 1;
          return;
        }
        newData[key] = 0;
      }
    });

    return newData;
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
