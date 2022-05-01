import { State } from "./state.js";

export class ThreeState extends State {
  constructor(marks, count, orders) {
    super(marks, count);
    this.orders = orders || this.mapPoints(() => 0);
  }

  toString() {
    return super.toString() + "\n" +
    this.orders.map(row =>
      row.join("")
    ).join("\n");
  }

  step(action) {
    const state = super.step(action);
    const x = action.x;
    const y = action.y;

    const orders = this.mapPoints((action0) => {
      let order = this.orders[action0.y][action0.x];
      if (order != 0) {
        order--;
      }
      if (action0.x == x && action0.y == y) {
        order = 6;
      }
      return order;
    });
    const marks = state.mapPoints((action0) => {
      if (orders[action0.y][action0.x] == 0) {
        return " ";
      }
      return state.mark(action0);
    });

    return new ThreeState(marks, state.count, orders);
  }
}
