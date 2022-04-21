import { Game } from '../../../src/js/modules/game.js';
import { Board } from '../../../src/js/modules/board.js';

test('constructor', () => {
  const game = new Game();
  expect(game.quality.map).toEqual({});
});

describe('#findAction', () => {
  test('epsilon = 1', () => {
    const game = new Game();
    const board = new Board();
    const action = game.findAction(board, 1);
    expect([0, 1, 2]).toContain(action[0]);
    expect([0, 1, 2]).toContain(action[1]);
  });

  test('epsilon = 0', () => {
    const game = new Game();
    const board = new Board();
    game.quality.set(board, [2, 1], 1);

    const action = game.findAction(board, 0);
    expect(action).toEqual([2, 1]);
  });
});

describe('#findEpisode', () => {
  test('epsilon = 1', () => {
    const game = new Game();
    const episode = game.findEpisode(1);

    const l = episode.length;
    expect(l).toBeGreaterThanOrEqual(6);
    expect(l).toBeLessThanOrEqual(10);

    for (let s = 0; s < l - 1; s++) {
      const board0 = episode[s].board;
      const board1 = episode[s + 1].board;
      const nextBoard = board0.step(episode[s].action);

      expect(board0.winner()).toBe(null);
      expect(nextBoard.state()).toBe(board1.state());
    }
    expect(episode[l - 1].board.winner()).not.toBe(null);
    expect(episode[l - 1].action).toBe(null);
  });

  test('epsilon = 0', () => {
    const game = new Game();
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

    game.quality.set(board0, action0, 1);
    game.quality.set(board1, action1, 1);
    game.quality.set(board2, action2, 1);
    game.quality.set(board3, action3, 1);
    game.quality.set(board4, action4, 1);

    const episode = game.findEpisode(0);

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


describe('#trainOne', () => {
  test('reward == 0', () => {
    const game = new Game();
    const board0 = new Board();
    const action0 = [1, 1];
    const board1 = board0.step(action0);
    const action1 = [1, 0];
    const board2 = board1.step(action1);
    game.quality.set(board2, [0, 0], 0.5);

    game.trainOne(board0, action0, board2, 0);
    expect(game.quality.get(board0, action0)).toBe(0.5 * 0.2);

    game.trainOne(board0, action0, board2, 0);
    expect(game.quality.get(board0, action0)).toBe(0.5 * 0.2 * (1 - 0.2) + 0.5 * 0.2);
  });

  test('reward != 0', () => {
    const game = new Game();
    const board0 = new Board([
      ["o", "x", "_"],
      ["_", "o", "x"],
      ["_", "_", "_"]
    ]);
    const action0 = [2, 2];
    const board1 = board0.step(action0);

    game.trainOne(board0, action0, board1, 1);
    expect(game.quality.get(board0, action0)).toBe(0.2);

    game.trainOne(board0, action0, board1, 1);
    expect(game.quality.get(board0, action0)).toBe(0.2 * (1 - 0.2) + 0.2);
  });
});

describe('#train', () => {
  test('o win', () => {
    const game = new Game();
    const actions = [
      [1, 1],
      [1, 0],
      [0, 0],
      [2, 1],
      [2, 2]
    ];

    let board = new Board();
    const boards = [board].concat(actions.map((action) => {
      board = board.step(action);
      return board;
    }));

    const episode = boards.map((board, i) => {
      return { board: board, action: actions[i] };
    });

    game.train(episode);

    expect(game.quality.get(boards[0], actions[0])).toBe(0.2**3);
    expect(game.quality.get(boards[1], actions[1])).toBe(0);
    expect(game.quality.get(boards[2], actions[2])).toBe(0.2**2);
    expect(game.quality.get(boards[3], actions[3])).toBe(-0.2);
    expect(game.quality.get(boards[4], actions[4])).toBe(0.2);

    game.train(episode);

    expect(game.quality.get(boards[0], actions[0])).toBe(0.02720000000000001);
    expect(game.quality.get(boards[1], actions[1])).toBe(0);
    expect(game.quality.get(boards[2], actions[2])).toBe(0.10400000000000002);
    expect(game.quality.get(boards[3], actions[3])).toBe(-0.2 * (1 - 0.2) - 0.2);
    expect(game.quality.get(boards[4], actions[4])).toBe(0.2 * (1 - 0.2) + 0.2);
  });

  test('x win', () => {
    const game = new Game();
    const actions = [
      [0, 0],
      [1, 1],
      [0, 1],
      [0, 2],
      [2, 1],
      [2, 0]
    ];

    let board = new Board();
    const boards = [board].concat(actions.map((action) => {
      board = board.step(action);
      return board;
    }));

    const episode = boards.map((board, i) => {
      return { board: board, action: actions[i] };
    });

    game.train(episode);

    expect(game.quality.get(boards[0], actions[0])).toBe(0);
    expect(game.quality.get(boards[1], actions[1])).toBe(0.2**3);
    expect(game.quality.get(boards[2], actions[2])).toBe(0);
    expect(game.quality.get(boards[3], actions[3])).toBe(0.2**2);
    expect(game.quality.get(boards[4], actions[4])).toBe(-0.2);
    expect(game.quality.get(boards[5], actions[5])).toBe(0.2);

    game.train(episode);

    expect(game.quality.get(boards[0], actions[0])).toBe(0);
    expect(game.quality.get(boards[1], actions[1])).toBe(0.02720000000000001);
    expect(game.quality.get(boards[2], actions[2])).toBe(0);
    expect(game.quality.get(boards[3], actions[3])).toBe(0.10400000000000002);
    expect(game.quality.get(boards[4], actions[4])).toBe(-0.2 * (1 - 0.2) - 0.2);
    expect(game.quality.get(boards[5], actions[5])).toBe(0.2 * (1 - 0.2) + 0.2);
  });

  test('draw', () => {
    const game = new Game();
    const actions = [
      [0, 0],
      [1, 1],
      [0, 1],
      [0, 2],
      [2, 1],
      [1, 0],
      [1, 2],
      [2, 2],
      [2, 0]
    ];

    let board = new Board();
    const boards = [board].concat(actions.map((action) => {
      board = board.step(action);
      return board;
    }));

    const episode = boards.map((board, i) => {
      return { board: board, action: actions[i] };
    });

    game.train(episode);

    expect(game.quality.get(boards[0], actions[0])).toBe(0);
    expect(game.quality.get(boards[1], actions[1])).toBe(0);
    expect(game.quality.get(boards[2], actions[2])).toBe(0);
    expect(game.quality.get(boards[3], actions[3])).toBe(0);
    expect(game.quality.get(boards[4], actions[4])).toBe(0);
    expect(game.quality.get(boards[5], actions[5])).toBe(0);
    expect(game.quality.get(boards[6], actions[6])).toBe(0);
    expect(game.quality.get(boards[7], actions[7])).toBe(0);
    expect(game.quality.get(boards[8], actions[8])).toBe(0);

    game.train(episode);

    expect(game.quality.get(boards[0], actions[0])).toBe(0);
    expect(game.quality.get(boards[1], actions[1])).toBe(0);
    expect(game.quality.get(boards[2], actions[2])).toBe(0);
    expect(game.quality.get(boards[3], actions[3])).toBe(0);
    expect(game.quality.get(boards[4], actions[4])).toBe(0);
    expect(game.quality.get(boards[5], actions[5])).toBe(0);
    expect(game.quality.get(boards[6], actions[6])).toBe(0);
    expect(game.quality.get(boards[7], actions[7])).toBe(0);
    expect(game.quality.get(boards[8], actions[8])).toBe(0);
  });
});

/*
test('train x 10000', () => {
  const game = new Game();

  for (let j = 0; j < 10; j++) {
    let output = {};
    output["o"] = 0;
    output["x"] = 0;
    output["-"] = 0;
    output["null"] = 0;

    for (let i = 0; i < 10000; i++) {
      const episode = game.findEpisode(0.1);
      game.train(episode);

      const event = episode[episode.length-1];
      const board = event.board;
      if (board.winner()) {
        output[board.winner()]++;
      } else {
        output["null"]++;
      }
    }
    console.log(output);
  }


  const episode = game.findEpisode(0);
  console.log(episode);
  episode.forEach((event) => {
    console.log(event.board.state());
    console.log(event.action);
    console.log(game.quality.m(event.board));
  });

});
*/