import { Action } from '../../../src/js/modules/action.js';
import { ThreeState } from '../../../src/js/modules/three_state.js';

describe('constructor', () => {
  test('no params', () => {
    const state = new ThreeState();

    expect(state.count).toBe(0);
    expect(state.marks).toEqual([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "]
    ]);
    expect(state.orders).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]);
  });

  test('with params', () => {
    const state = new ThreeState([
      [" ", " ", " "],
      ["x", " ", " "],
      [" ", "o", " "]
    ], 2, [
      [0, 0, 0],
      [5, 0, 0],
      [0, 6, 0]
    ]);

    expect(state.count).toBe(2);
    expect(state.marks).toEqual([
      [" ", " ", " "],
      ["x", " ", " "],
      [" ", "o", " "]
    ]);
    expect(state.orders).toEqual([
      [0, 0, 0],
      [5, 0, 0],
      [0, 6, 0]
    ]);
  });
});

test('#toString', () => {
  const state = new ThreeState([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ], 2, [
    [0, 0, 0],
    [5, 0, 0],
    [0, 6, 0]
  ]);

  expect(state.toString()).toEqual(
    "   " + "\n" +
    "x  " + "\n" +
    " o " + "\n" +
    "000" + "\n" +
    "500" + "\n" +
    "060"
  );
});

test('#step', () => {
  let state = new ThreeState();

  const actions = [
    new Action(0, 0),
    new Action(2, 2),
    new Action(2, 1),
    new Action(0, 1),
    new Action(1, 2)
  ];

  actions.forEach((action) => {
    state = state.step(action);
  });

  expect(state.count).toBe(5);
  expect(state.marks).toEqual([
    ["o", " ", " "],
    ["x", " ", "o"],
    [" ", "o", "x"]
  ]);
  expect(state.orders).toEqual([
    [2, 0, 0],
    [5, 0, 4],
    [0, 6, 3]
  ]);

  state = state.step(new Action(1, 0));
  expect(state.count).toBe(6);
  expect(state.marks).toEqual([
    ["o", "x", " "],
    ["x", " ", "o"],
    [" ", "o", "x"]
  ]);
  expect(state.orders).toEqual([
    [1, 6, 0],
    [4, 0, 3],
    [0, 5, 2]
  ]);

  state = state.step(new Action(2, 0));
  expect(state.count).toBe(7);
  expect(state.marks).toEqual([
    [" ", "x", "o"],
    ["x", " ", "o"],
    [" ", "o", "x"]
  ]);
  expect(state.orders).toEqual([
    [0, 5, 6],
    [3, 0, 2],
    [0, 4, 1]
  ]);

  state = state.step(new Action(0, 2));
  expect(state.count).toBe(8);
  expect(state.marks).toEqual([
    [" ", "x", "o"],
    ["x", " ", "o"],
    ["x", "o", " "]
  ]);
  expect(state.orders).toEqual([
    [0, 4, 5],
    [2, 0, 1],
    [6, 3, 0]
  ]);

  state = state.step(new Action(1, 1));
  expect(state.count).toBe(9);
  expect(state.marks).toEqual([
    [" ", "x", "o"],
    ["x", "o", " "],
    ["x", "o", " "]
  ]);
  expect(state.orders).toEqual([
    [0, 3, 4],
    [1, 6, 0],
    [5, 2, 0]
  ]);
});
