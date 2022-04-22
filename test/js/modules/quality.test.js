import { Quality } from '../../../src/js/modules/quality.js';
import { Board } from '../../../src/js/modules/board.js';

test('constructor', () => {
  const quality = new Quality();
  expect(quality.map).toEqual({});
});

test('#get/#set/#m', () => {
  const quality = new Quality();
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);

  expect(quality.m(board)).toEqual([
    [0, 0, 0],
    [null, 0, 0],
    [0, null, 0]
  ]);

  expect(quality.get(board, [0, 0])).toBe(0);
  expect(quality.get(board, [1, 0])).toBe(0);
  expect(quality.get(board, [0, 1])).toBe(null);
  expect(quality.get(board, [2, 1])).toBe(0);

  quality.set(board, [0, 0], 0.1);
  quality.set(board, [1, 0], 0.2);
  quality.set(board, [2, 1], 0.3);

  expect(quality.get(board, [0, 0])).toBe(0.1);
  expect(quality.get(board, [1, 0])).toBe(0.2);
  expect(quality.get(board, [0, 1])).toBe(null);
  expect(quality.get(board, [2, 1])).toBe(0.3);

  expect(quality.m(board)).toEqual([
    [0.1, 0.2, 0],
    [null, 0, 0.3],
    [0, null, 0]
  ]);
});

describe('#value', () => {
  test('exist actions', () => {
    const quality = new Quality();
    const board = new Board([
      ["_", "_", "_"],
      ["x", "_", "_"],
      ["_", "o", "_"]
    ]);

    expect(quality.value(board)).toEqual(0);

    quality.set(board, [0, 0], 0.1);
    quality.set(board, [1, 0], 0.2);
    quality.set(board, [2, 1], 0.3);

    expect(quality.value(board)).toEqual(0.3);
  });

  test('no actions', () => {
    const quality = new Quality();
    const board = new Board([
      ["o", "x", "o"],
      ["o", "x", "o"],
      ["x", "o", "x"]
    ]);

    expect(quality.value(board)).toEqual(0);
  });
});

test('#policy', () => {
  const quality = new Quality();
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);

  expect(quality.policy(board)).toEqual([0, 0]);

  quality.set(board, [0, 0], 0.1);
  quality.set(board, [1, 0], 0.2);
  quality.set(board, [2, 1], 0.3);

  expect(quality.policy(board)).toEqual([2, 1]);
});
