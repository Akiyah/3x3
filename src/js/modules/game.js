import { Board } from './board.js';

export class Game {
  createEpisode(epsilon = 0) {
    let board = new Board();
    const episode = [];

    while(board.winner() === null) {
      const [x, y] = board.randomAction();
      episode.push({ board: board, action: [x, y] });
      board = board.step(x, y);
    }

    episode.push({ board: board, action: null });
    return episode;
  }

  train(episode, quarity) {
  }
}
