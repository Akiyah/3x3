import { Action } from '../../../src/js/modules/action.js';
import { Quality } from '../../../src/js/modules/quality.js';
import { State } from '../../../src/js/modules/state.js';

test('constructor', () => {
  const quality = new Quality();
  expect(quality.map).toEqual({});
});

test('#get/#set/#m', () => {
  const quality = new Quality();
  const state = new State([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);

  expect(quality.m(state)).toEqual({});

  expect(quality.get(state, new Action(0, 0))).toBe(0);
  expect(quality.get(state, new Action(1, 0))).toBe(0);
  expect(quality.get(state, new Action(0, 1))).toBe(0); // not enable action
  expect(quality.get(state, new Action(2, 1))).toBe(0);

  quality.set(state, new Action(0, 0), 0.1);
  quality.set(state, new Action(1, 0), 0.2);
  quality.set(state, new Action(2, 1), 0.3);

  expect(quality.get(state, new Action(0, 0))).toBe(0.1);
  expect(quality.get(state, new Action(1, 0))).toBe(0.2);
  expect(quality.get(state, new Action(0, 1))).toBe(0); // not enable action
  expect(quality.get(state, new Action(2, 1))).toBe(0.3);

  expect(quality.m(state)).toEqual({
    "[0, 0]": 0.1,
    "[1, 0]": 0.2,
    "[2, 1]": 0.3
  });
});

describe('#value', () => {
  test('exist actions', () => {
    const quality = new Quality();
    const state = new State([
      [" ", " ", " "],
      ["x", " ", " "],
      [" ", "o", " "]
    ]);

    expect(quality.value(state)).toEqual(0);

    quality.set(state, new Action(0, 0), 0.1);
    quality.set(state, new Action(1, 0), 0.2);
    quality.set(state, new Action(2, 1), 0.3);

    expect(quality.value(state)).toEqual(0.3);
  });

  test('exist minus actions', () => {
    const quality = new Quality();
    const state = new State([
      [" ", " ", " "],
      ["x", " ", " "],
      [" ", "o", " "]
    ]);

    expect(quality.value(state)).toEqual(0);

    quality.set(state, new Action(0, 0), -0.1);
    quality.set(state, new Action(1, 0), -0.2);
    quality.set(state, new Action(2, 1), -0.3);

    expect(quality.value(state)).toEqual(0);
  });

  test('no actions', () => {
    const quality = new Quality();
    const state = new State([
      ["o", "x", "o"],
      ["o", "x", "o"],
      ["x", "o", "x"]
    ]);

    expect(quality.value(state)).toEqual(0);
  });
});

test('#policy', () => {
  const quality = new Quality();
  const state = new State([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);

  expect(quality.policy(state)).toEqual(new Action(0, 0));

  quality.set(state, new Action(0, 0), 0.1);
  quality.set(state, new Action(1, 0), 0.2);
  quality.set(state, new Action(2, 1), 0.3);

  expect(quality.policy(state)).toEqual(new Action(2, 1));
});

test('#count', () => {
  const quality = new Quality();
  const state0 = new State();
  const state1 = new State([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);

  expect(quality.count()).toBe(0);

  quality.set(state0, new Action(0, 0), 0.1);
  expect(quality.count()).toBe(1);

  quality.set(state0, new Action(1, 0), 0.2);
  expect(quality.count()).toBe(2);

  quality.set(state1, new Action(2, 1), 0.3);
  expect(quality.count()).toBe(3);

  quality.set(state1, new Action(2, 2), 0);
  expect(quality.count()).toBe(4);
});
