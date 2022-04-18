import { Game } from '../../../src/js/modules/game.js';

test('constructor', () => {
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
    expect(nextBoard.key()).toBe(board1.key());
  }
  expect(episode[l - 1].board.winner()).not.toBe(null);
});
