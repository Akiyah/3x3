import { Action } from '../../../src/js/modules/action.js';
import { State } from '../../../src/js/modules/state.js';

describe('constructor', () => {
  test('no params', () => {
    const state = new State();

    expect(state.marks).toEqual([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "]
    ]);
  });

  test('with params', () => {
    const state = new State([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", "o", " "]
    ]);

    expect(state.marks).toEqual([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", "o", " "]
    ]);
  });
});

test('#toString', () => {
  let state = new State();
  state = state.step(new Action(1, 2));
  state = state.step(new Action(0, 1));
  expect(state.toString()).toEqual(
    "   " + "\n" +
    "x  " + "\n" +
    " o "
  );
});

test('#mapPoints', () => {
  let state = new State();
  state = state.step(new Action(1, 2));
  state = state.step(new Action(0, 1));
  const result = state.mapPoints((action) => action);
  expect(result).toEqual([
    [new Action(0, 0), new Action(1, 0), new Action(2, 0)],
    [new Action(0, 1), new Action(1, 1), new Action(2, 1)],
    [new Action(0, 2), new Action(1, 2), new Action(2, 2)]
  ]);
});

test('#mark', () => {
  const state = new State([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);
  expect(state.mark(new Action(0, 0))).toEqual(" ");
  expect(state.mark(new Action(1, 2))).toEqual("o");
  expect(state.mark(new Action(0, 1))).toEqual("x");
});

test('#nextPlayer', () => {
  let state = new State();
  expect(state.nextPlayer()).toBe("o");

  state = state.step(new Action(1, 1));
  expect(state.nextPlayer()).toBe("x");

  state = state.step(new Action(0, 0));
  expect(state.nextPlayer()).toBe("o");
});

test('#step', () => {
  let state = new State();
  state = state.step(new Action(1, 2));
  expect(state.marks).toEqual([
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", "o", " "]
  ]);

  state = state.step(new Action(0, 1));
  expect(state.marks).toEqual([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);
});

test('#enable', () => {
  let state = new State();
  state = state.step(new Action(1, 2));
  state = state.step(new Action(0, 1));
  expect(state.enable(new Action(0, 0))).toBeTruthy();
  expect(state.enable(new Action(1, 2))).toBeFalsy();
  expect(state.enable(new Action(0, 1))).toBeFalsy();
});

test('#actions', () => {
  let state = new State();
  state = state.step(new Action(1, 2));
  state = state.step(new Action(0, 1));
  expect(state.actions()).toEqual([
    new Action(0, 0), new Action(1, 0), new Action(2, 0),
    new Action(1, 1), new Action(2, 1),
    new Action(0, 2), new Action(2, 2)
  ]);
});

test('#randomAction', () => {
  let state = new State();
  state = state.step(new Action(1, 2));
  state = state.step(new Action(0, 1));
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
    [new Action(0, 0), new Action(0, 1), new Action(0, 2)], // |
    [new Action(1, 0), new Action(1, 1), new Action(1, 2)], // |
    [new Action(2, 0), new Action(2, 1), new Action(2, 2)], // |
    [new Action(0, 0), new Action(1, 0), new Action(2, 0)], // -
    [new Action(0, 1), new Action(1, 1), new Action(2, 1)], // -
    [new Action(0, 2), new Action(1, 2), new Action(2, 2)], // -
    [new Action(0, 0), new Action(1, 1), new Action(2, 2)], // \
    [new Action(0, 2), new Action(1, 1), new Action(2, 0)]  // /
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
      [" ", "o", " "],
      ["x", "o", "x"],
      [" ", "o", " "]
    ]);
    expect(state.isWin('o')).toBeTruthy();
    expect(state.isWin('x')).toBeFalsy();
  });

  test('x win', () => {
    const state = new State([
      ["o", " ", "x"],
      [" ", "x", " "],
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
      [" ", "o", " "],
      ["x", "o", "x"],
      [" ", "o", " "]
    ]);
    expect(state.winner()).toEqual("o");
  });

  test('x win', () => {
    const state = new State([
      ["o", " ", "x"],
      [" ", "x", " "],
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

describe('#reward', () => {
  test('no winners', () => {
    const state = new State();
    expect(state.reward()).toBe(0);
  });

  test('o win', () => {
    const state = new State([
      [" ", "o", " "],
      ["x", "o", "x"],
      [" ", "o", " "]
    ]);
    expect(state.reward()).toBe(1);
  });

  test('x win', () => {
    const state = new State([
      ["o", " ", "x"],
      [" ", "x", " "],
      ["x", "o", "o"]
    ]);
    expect(state.reward()).toBe(-1);
  });

  test('draw', () => {
    const state = new State([
      ["o", "x", "o"],
      ["x", "o", "o"],
      ["x", "o", "x"]
    ]);
    expect(state.reward()).toBe(0);
  });
});
