import { Board } from './board.js';
import { Quality } from './quality.js';

export class Game {
  constructor(quality = new Quality()) {
    this.quality = quality;
  }

  createAction(board, epsilon) {
    if (Math.random() < epsilon) {
      return board.randomAction();
    } else {
      return this.quality.policy(board);
    }
  }

  createEpisode(epsilon) {
    let board = new Board();
    const episode = [];

    while(board.winner() === null) {
      const action = this.createAction(board, epsilon);
      episode.push({ board: board, action: action });
      board = board.step(...action);
    }

    episode.push({ board: board, action: null });
    return episode;
  }

  train(episode, quarity) {
  }
}
