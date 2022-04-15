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

test('.normalKeys', () => {
  const keys = Board.normalKeys();

  expect(keys.length).toBe(765);
  expect(keys).toContain(
    "___" + "\n" +
    "___" + "\n" +
    "___"
  );
  expect(keys).toContain(
    "_x_" + "\n" +
    "o__" + "\n" +
    "___"
  );
  expect(keys).not.toContain(
    "___" + "\n" +
    "x__" + "\n" +
    "_o_"
  );
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

test('#markIndex', () => {
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(board.markIndex(0, 0)).toBe(0);
  expect(board.markIndex(1, 2)).toBe(1);
  expect(board.markIndex(0, 1)).toBe(2);
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

test('#index', () => {
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(board.index()).toEqual(
    0 * 3 ** 0 + 0 * 3 ** 1 + 0 * 3 ** 2 +
    2 * 3 ** 3 + 0 * 3 ** 4 + 0 * 3 ** 5 +
    0 * 3 ** 6 + 1 * 3 ** 7 + 0 * 3 ** 8
  );
});

test('#isBlank', () => {
  let board = new Board();
  board = board.step(1, 2);
  board = board.step(0, 1);
  expect(board.isBlank(0, 0)).toBeTruthy();
  expect(board.isBlank(1, 2)).toBeFalsy();
  expect(board.isBlank(0, 1)).toBeFalsy();
});

test('#blankPoints', () => {
  let board = new Board();
  board = board.step(1, 2);
  board = board.step(0, 1);
  expect(board.blankPoints()).toEqual([
    [0, 0], [1, 0], [2, 0],
    [1, 1], [2, 1],
    [0, 2], [2, 2]
  ]);
});

test('#rotate', () => {
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(board.rotate().marks).toEqual([
    ["_", "x", "_"],
    ["o", "_", "_"],
    ["_", "_", "_"]
  ]);
});

test('#turn', () => {
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(board.turn().marks).toEqual([
    ["_", "_", "_"],
    ["_", "_", "x"],
    ["_", "o", "_"]
  ]);
});

test('#translateBoards', () => {
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  const boards = board.translateBoards();
  expect(boards).toHaveLength(8);
  expect(boards[0].marks).toEqual([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(boards[1].marks).toEqual([
    ["_", "x", "_"],
    ["o", "_", "_"],
    ["_", "_", "_"]
  ]);
  expect(boards[2].marks).toEqual([
    ["_", "o", "_"],
    ["_", "_", "x"],
    ["_", "_", "_"]
  ]);
  expect(boards[3].marks).toEqual([
    ["_", "_", "_"],
    ["_", "_", "o"],
    ["_", "x", "_"]
  ]);
  expect(boards[4].marks).toEqual([
    ["_", "_", "_"],
    ["_", "_", "x"],
    ["_", "o", "_"]
  ]);
  expect(boards[5].marks).toEqual([
    ["_", "_", "_"],
    ["o", "_", "_"],
    ["_", "x", "_"]
  ]);
  expect(boards[6].marks).toEqual([
    ["_", "o", "_"],
    ["x", "_", "_"],
    ["_", "_", "_"]
  ]);
  expect(boards[7].marks).toEqual([
    ["_", "x", "_"],
    ["_", "_", "o"],
    ["_", "_", "_"]
  ]);
});

test('#normalize', () => {
  const board = new Board([
    ["_", "_", "_"],
    ["x", "_", "_"],
    ["_", "o", "_"]
  ]);
  expect(board.normalize().marks).toEqual([
    ["_", "x", "_"],
    ["o", "_", "_"],
    ["_", "_", "_"]
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

describe('#status', () => {
  test('no winners', () => {
    const board = new Board();
    expect(board.status()).toEqual("");
  });

  test('o win', () => {
    const board = new Board([
      ["_", "o", "_"],
      ["x", "o", "x"],
      ["_", "o", "_"]
    ]);
    expect(board.status()).toEqual("o win");
  });

  test('x win', () => {
    const board = new Board([
      ["o", "_", "x"],
      ["_", "x", "_"],
      ["x", "o", "o"]
    ]);
    expect(board.status()).toEqual("x win");
  });

  test('draw', () => {
    const board = new Board([
      ["o", "x", "o"],
      ["x", "o", "o"],
      ["x", "o", "x"]
    ]);
    expect(board.status()).toEqual("draw");
  });
});

describe('#reword', () => {
  test('no winners', () => {
    const board = new Board();
    expect(board.reword()).toBe(null);
  });

  test('o win', () => {
    const board = new Board([
      ["_", "o", "_"],
      ["x", "o", "x"],
      ["_", "o", "_"]
    ]);
    expect(board.reword()).toBe(1);
  });

  test('x win', () => {
    const board = new Board([
      ["o", "_", "x"],
      ["_", "x", "_"],
      ["x", "o", "o"]
    ]);
    expect(board.reword()).toBe(-1);
  });

  test('draw', () => {
    const board = new Board([
      ["o", "x", "o"],
      ["x", "o", "o"],
      ["x", "o", "x"]
    ]);
    expect(board.reword()).toBe(0);
  });
});
