import { Game } from '../../../src/js/modules/game.js';
import { Board } from '../../../src/js/modules/board.js';

test('constructor', () => {
  const game = new Game();
  expect(game.quality.map).toEqual({});
});

describe('#createAction', () => {
  test('epsilon = 1', () => {
    const game = new Game();
    const board = new Board();

    const action = game.createAction(board, 1);
    expect([0, 1, 2]).toContain(action[0]);
    expect([0, 1, 2]).toContain(action[1]);
  });

  test('epsilon = 0', () => {
    const game = new Game();
    const board = new Board();

    game.quality.set(board, [2, 1], 1);

    const action = game.createAction(board, 0);
    expect(action).toEqual([2, 1]);
  });
});

describe('#createEpisode', () => {
  test('epsilon = 1', () => {
    const game = new Game();
    const episode = game.createEpisode(1);

    const l = episode.length;
    expect(l).toBeGreaterThanOrEqual(6);
    expect(l).toBeLessThanOrEqual(10);

    for (let s = 0; s < l - 1; s++) {
      const board0 = episode[s].board;
      const board1 = episode[s + 1].board;
      const [x, y] = episode[s].action;
      const nextBoard = board0.step(x, y);

      expect(board0.winner()).toBe(null);
      expect(nextBoard.state()).toBe(board1.state());
    }
    expect(episode[l - 1].board.winner()).not.toBe(null);
    expect(episode[l - 1].action).toBe(null);
  });

  test('epsilon = 0', () => {
    const board0 = new Board([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"]
    ]);
    const action0 = [1, 1];
    const board1 = new Board([
      ["_", "_", "_"],
      ["_", "o", "_"],
      ["_", "_", "_"]
    ]);
    const action1 = [1, 0];
    const board2 = new Board([
      ["_", "x", "_"],
      ["_", "o", "_"],
      ["_", "_", "_"]
    ]);
    const action2 = [0, 0];
    const board3 = new Board([
      ["o", "x", "_"],
      ["_", "o", "_"],
      ["_", "_", "_"]
    ]);
    const action3 = [2, 1];
    const board4 = new Board([
      ["o", "x", "_"],
      ["_", "o", "x"],
      ["_", "_", "_"]
    ]);
    const action4 = [2, 2];
    const board5 = new Board([
      ["o", "x", "_"],
      ["_", "o", "x"],
      ["_", "_", "o"]
    ]);

    const game = new Game();
    game.quality.set(board0, action0, 1);
    game.quality.set(board1, action1, 1);
    game.quality.set(board2, action2, 1);
    game.quality.set(board3, action3, 1);
    game.quality.set(board4, action4, 1);

    const episode = game.createEpisode(0);

    expect(episode.length).toBe(6);

    expect(episode[0].board.state()).toBe(board0.state());
    expect(episode[1].board.state()).toBe(board1.state());
    expect(episode[2].board.state()).toBe(board2.state());
    expect(episode[3].board.state()).toBe(board3.state());
    expect(episode[4].board.state()).toBe(board4.state());
    expect(episode[5].board.state()).toBe(board5.state());

    expect(episode[0].action).toEqual(action0);
    expect(episode[1].action).toEqual(action1);
    expect(episode[2].action).toEqual(action2);
    expect(episode[3].action).toEqual(action3);
    expect(episode[4].action).toEqual(action4);
    expect(episode[5].action).toEqual(null);
  });
});