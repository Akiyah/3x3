import { Quality } from '../../../src/js/modules/quality.js';
import { Board } from '../../../src/js/modules/board.js';

test('constructor', () => {
  const quality = new Quality();
  expect(quality.map).toEqual({});
});

test('#get/#set/#m', () => {
  const quality = new Quality();
  const state = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);

  expect(quality.m(state)).toEqual({
    "0,0": 0,
    "1,0": 0,
    "2,0": 0,
    "1,1": 0,
    "2,1": 0,
    "0,2": 0,
    "2,2": 0
  });

  expect(quality.get(state, [0, 0])).toBe(0);
  expect(quality.get(state, [1, 0])).toBe(0);
  expect(quality.get(state, [0, 1])).toBe(undefined);
  expect(quality.get(state, [2, 1])).toBe(0);

  quality.set(state, [0, 0], 0.1);
  quality.set(state, [1, 0], 0.2);
  quality.set(state, [2, 1], 0.3);

  expect(quality.get(state, [0, 0])).toBe(0.1);
  expect(quality.get(state, [1, 0])).toBe(0.2);
  expect(quality.get(state, [0, 1])).toBe(undefined);
  expect(quality.get(state, [2, 1])).toBe(0.3);

  expect(quality.m(state)).toEqual({
    "0,0": 0.1,
    "1,0": 0.2,
    "2,0": 0,
    "1,1": 0,
    "2,1": 0.3,
    "0,2": 0,
    "2,2": 0
  });
});

describe('#value', () => {
  test('exist actions', () => {
    const quality = new Quality();
    const state = new Board([
      ["_", "_", "_"],
      ["x", "_", "_"],
      ["_", "o", "_"]
    ]);

    expect(quality.value(state)).toEqual(0);

    quality.set(state, [0, 0], 0.1);
    quality.set(state, [1, 0], 0.2);
    quality.set(state, [2, 1], 0.3);

    expect(quality.value(state)).toEqual(0.3);
  });

  test('no actions', () => {
    const quality = new Quality();
    const state = new Board([
      ["o", "x", "o"],
      ["o", "x", "o"],
      ["x", "o", "x"]
    ]);

    expect(quality.value(state)).toEqual(0);
  });
});

test('#policy', () => {
  const quality = new Quality();
  const state = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);

  expect(quality.policy(state)).toEqual([0, 0]);

  quality.set(state, [0, 0], 0.1);
  quality.set(state, [1, 0], 0.2);
  quality.set(state, [2, 1], 0.3);

  expect(quality.policy(state)).toEqual([2, 1]);
});
