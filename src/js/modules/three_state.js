import { State } from "./state.js";

export class ThreeState extends State {
  step(action) {
    const x = action.x;
    const y = action.y;
    const mark = this.nextPlayerMark();

    let marks = this.mapPoints((a) => this.mark(a));

    let actions = this.actions(mark);

    if (3 <= actions.length) {
      const i = this.random(actions.length);
      const deleteAction = actions[i];
      marks[deleteAction.y][deleteAction.x] = " ";
    }

    marks[action.y][action.x] = mark;

    return new ThreeState(marks, this.count + 1);
  }
}
