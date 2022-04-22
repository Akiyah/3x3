import { State } from '../../../src/js/modules/board.js';

describe('constructor', () => {
  test('no params', () => {
    const state = new State();

    expect(state.marks).toEqual([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"]
    ]);
  });

  test('with params', () => {
    const state = new State([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "o", "_"]
    ]);

    expect(state.marks).toEqual([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "o", "_"]
    ]);
  });
});

test('#toString', () => {
  let state = new State();
  state = state.step([1, 2]);
  state = state.step([0, 1]);
  expect(state.toString()).toEqual(
    "___" + "\n" +
    "x__" + "\n" +
    "_o_"
  );
});

test('#mapPoints', () => {
  let state = new State();
  state = state.step([1, 2]);
  state = state.step([0, 1]);
  const result = state.mapPoints(([x, y]) => [x, y]);
  expect(result).toEqual([
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]]
  ]);
});

test('#mark', () => {
  const state = new State([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(state.mark([0, 0])).toEqual("_");
  expect(state.mark([1, 2])).toEqual("o");
  expect(state.mark([0, 1])).toEqual("x");
});

test('#step', () => {
  let state = new State();
  state = state.step([1, 2]);
  expect(state.marks).toEqual([
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "o", "_"]
  ]);

  state = state.step([0, 1]);
  expect(state.marks).toEqual([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
});

test('#enable', () => {
  let state = new State();
  state = state.step([1, 2]);
  state = state.step([0, 1]);
  expect(state.enable([0, 0])).toBeTruthy();
  expect(state.enable([1, 2])).toBeFalsy();
  expect(state.enable([0, 1])).toBeFalsy();
});

test('#actions', () => {
  let state = new State();
  state = state.step([1, 2]);
  state = state.step([0, 1]);
  expect(state.actions()).toEqual([
    [0, 0], [1, 0], [2, 0],
    [1, 1], [2, 1],
    [0, 2], [2, 2]
  ]);
});

test('#randomAction', () => {
  let state = new State();
  state = state.step([1, 2]);
  state = state.step([0, 1]);
  expect(state.actions()).toContainEqual(state.randomAction());
});

test('#random', () => {
  let state = new State();
  let results = [];
  for (let i = 0; i < 100; i++) {
    results.push(state.random(10));
  }
  expect(Math.min(...results)).toBe(0);
  expect(Math.max(...results)).toBe(9);
});

test('#lines', () => {
  const state = new State();
  expect(state.lines()).toEqual([
    [[0, 0], [0, 1], [0, 2]], // |
    [[1, 0], [1, 1], [1, 2]], // |
    [[2, 0], [2, 1], [2, 2]], // |
    [[0, 0], [1, 0], [2, 0]], // -
    [[0, 1], [1, 1], [2, 1]], // -
    [[0, 2], [1, 2], [2, 2]], // -
    [[0, 0], [1, 1], [2, 2]], // \
    [[0, 2], [1, 1], [2, 0]]  // /
  ]);
});

describe('#isWin', () => {
  test('no winners', () => {
    const state = new State();
    expect(state.isWin('o')).toBeFalsy();
    expect(state.isWin('x')).toBeFalsy();
  });

  test('o win', () => {
    const state = new State([
      ["_", "o", "_"],
      ["x", "o", "x"],
      ["_", "o", "_"]
    ]);
    expect(state.isWin('o')).toBeTruthy();
    expect(state.isWin('x')).toBeFalsy();
  });

  test('x win', () => {
    const state = new State([
      ["o", "_", "x"],
      ["_", "x", "_"],
      ["x", "o", "o"]
    ]);
    expect(state.isWin('o')).toBeFalsy();
    expect(state.isWin('x')).toBeTruthy();
  });

  test('draw?', () => {
    const state = new State([
      ["o", "x", "o"],
      ["x", "o", "o"],
      ["x", "o", "x"]
    ]);
    expect(state.isWin('o')).toBeFalsy();
    expect(state.isWin('x')).toBeFalsy();
  });
});

describe('#winner', () => {
  test('no winners', () => {
    const state = new State();
    expect(state.winner()).toBe(null);
  });

  test('o win', () => {
    const state = new State([
      ["_", "o", "_"],
      ["x", "o", "x"],
      ["_", "o", "_"]
    ]);
    expect(state.winner()).toEqual("o");
  });

  test('x win', () => {
    const state = new State([
      ["o", "_", "x"],
      ["_", "x", "_"],
      ["x", "o", "o"]
    ]);
    expect(state.winner()).toEqual("x");
  });

  test('draw', () => {
    const state = new State([
      ["o", "x", "o"],
      ["x", "o", "o"],
      ["x", "o", "x"]
    ]);
    expect(state.winner()).toEqual("-");
  });
});
