import { Action } from '../../../src/js/modules/action.js';
import { RandomThreeState } from '../../../src/js/modules/random_three_state.js';

test('#step', () => {
  let state = new RandomThreeState();

  const actions = [
    new Action(0, 0),
    new Action(2, 2),
    new Action(2, 1),
    new Action(0, 1),
    new Action(1, 2),
    new Action(1, 0)
  ];

  actions.forEach((action) => {
    state = state.step(action);
  });

  expect(state.count).toBe(6);
  expect(state.marks).toEqual([
    ["o", "x", " "],
    ["x", " ", "o"],
    [" ", "o", "x"]
  ]);
  expect(state.marks.flat().filter((mark) => mark == "o").length).toBe(3);
  expect(state.marks.flat().filter((mark) => mark == "x").length).toBe(3);

  state = state.step(new Action(2, 0));
  expect(state.count).toBe(7);
  expect(state.marks.flat().filter((mark) => mark == "o").length).toBe(3);
  expect(state.marks.flat().filter((mark) => mark == "x").length).toBe(3);

  state = state.step(new Action(0, 2));
  expect(state.count).toBe(8);
  expect(state.marks.flat().filter((mark) => mark == "o").length).toBe(3);
  expect(state.marks.flat().filter((mark) => mark == "x").length).toBe(3);
});
