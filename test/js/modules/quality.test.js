import { Quality } from '../../../src/js/modules/quality.js';
import { Board } from '../../../src/js/modules/board.js';

test('constructor', () => {
  const quality = new Quality();
  expect(quality.map).toEqual({});
});

test('#get/#set/#m', () => {
  const quality = new Quality();
  const state =
    "___" + "\n" +
    "x__" + "\n" +
    "_o_";
  const board = Board.create(state);

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

test('#value', () => {
  const quality = new Quality();
  const state =
    "___" + "\n" +
    "x__" + "\n" +
    "_o_";
  const board = Board.create(state);

  expect(quality.value(board)).toEqual(0);

  quality.set(board, [0, 0], 0.1);
  quality.set(board, [1, 0], 0.2);
  quality.set(board, [2, 1], 0.3);

  expect(quality.value(board)).toEqual(0.3);
});

test('#policy', () => {
  const quality = new Quality();
  const state =
    "___" + "\n" +
    "x__" + "\n" +
    "_o_";
  const board = Board.create(state);

  expect(quality.policy(board)).toEqual([0, 0]);

  quality.set(board, [0, 0], 0.1);
  quality.set(board, [1, 0], 0.2);
  quality.set(board, [2, 1], 0.3);

  expect(quality.policy(board)).toEqual([2, 1]);
});
