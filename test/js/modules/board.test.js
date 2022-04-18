import { Board } from '../../../src/js/modules/board.js';

describe('constructor', () => {
  test('no params', () => {
    const board = new Board();

    expect(board.marks).toEqual([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"]
    ]);
  });

  test('with params', () => {
    const board = new Board([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "o", "_"]
    ]);

    expect(board.marks).toEqual([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "o", "_"]
    ]);
  });
});

test('.create', () => {
  const key =
    "___" + "\n" +
    "x__" + "\n" +
    "_o_";
  const board = Board.create(key);
  expect(board.marks).toEqual([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
});

test('#key', () => {
  let board = new Board();
  board = board.step(1, 2);
  board = board.step(0, 1);
  expect(board.key()).toEqual(
    "___" + "\n" +
    "x__" + "\n" +
    "_o_"
  );
});

test('#mapPoints', () => {
  let board = new Board();
  board = board.step(1, 2);
  board = board.step(0, 1);
  const result = board.mapPoints((x, y) => [x, y]);
  expect(result).toEqual([
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]]
  ]);
});

test('#mark', () => {
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(board.mark(0, 0)).toEqual("_");
  expect(board.mark(1, 2)).toEqual("o");
  expect(board.mark(0, 1)).toEqual("x");
});

test('#step', () => {
  let board = new Board();
  board = board.step(1, 2);
  expect(board.marks).toEqual([
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "o", "_"]
  ]);

  board = board.step(0, 1);
  expect(board.marks).toEqual([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
});

test('#isBlank', () => {
  let board = new Board();
  board = board.step(1, 2);
  board = board.step(0, 1);
  expect(board.isBlank(0, 0)).toBeTruthy();
  expect(board.isBlank(1, 2)).toBeFalsy();
  expect(board.isBlank(0, 1)).toBeFalsy();
});

test('#actions', () => {
  let board = new Board();
  board = board.step(1, 2);
  board = board.step(0, 1);
  expect(board.actions()).toEqual([
    [0, 0], [1, 0], [2, 0],
    [1, 1], [2, 1],
    [0, 2], [2, 2]
  ]);
});

test('#random', () => {
  let board = new Board();
  let results = [];
  for (let i = 0; i < 100; i++) {
    results.push(board.random(10));
  }
  expect(Math.min(...results)).toBe(0);
  expect(Math.max(...results)).toBe(9);
});

test('#lines', () => {
  const board = new Board();
  expect(board.lines()).toEqual([
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
    const board = new Board();
    expect(board.isWin('o')).toBeFalsy();
    expect(board.isWin('x')).toBeFalsy();
  });

  test('o win', () => {
    const board = new Board([
      ["_", "o", "_"],
      ["x", "o", "x"],
      ["_", "o", "_"]
    ]);
    expect(board.isWin('o')).toBeTruthy();
    expect(board.isWin('x')).toBeFalsy();
  });

  test('x win', () => {
    const board = new Board([
      ["o", "_", "x"],
      ["_", "x", "_"],
      ["x", "o", "o"]
    ]);
    expect(board.isWin('o')).toBeFalsy();
    expect(board.isWin('x')).toBeTruthy();
  });

  test('draw?', () => {
    const board = new Board([
      ["o", "x", "o"],
      ["x", "o", "o"],
      ["x", "o", "x"]
    ]);
    expect(board.isWin('o')).toBeFalsy();
    expect(board.isWin('x')).toBeFalsy();
  });
});

describe('#winner', () => {
  test('no winners', () => {
    const board = new Board();
    expect(board.winner()).toBe(null);
  });

  test('o win', () => {
    const board = new Board([
      ["_", "o", "_"],
      ["x", "o", "x"],
      ["_", "o", "_"]
    ]);
    expect(board.winner()).toEqual("o");
  });

  test('x win', () => {
    const board = new Board([
      ["o", "_", "x"],
      ["_", "x", "_"],
      ["x", "o", "o"]
    ]);
    expect(board.winner()).toEqual("x");
  });

  test('draw', () => {
    const board = new Board([
      ["o", "x", "o"],
      ["x", "o", "o"],
      ["x", "o", "x"]
    ]);
    expect(board.winner()).toEqual("-");
  });
});
