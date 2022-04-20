import { Board } from './board.js';
import { Quality } from './quality.js';

const α = 0.2;
const γ = 1;

export class Game {
  constructor(quality = new Quality()) {
    this.quality = quality;
  }

  findAction(board, epsilon) {
    if (Math.random() < epsilon) {
      return board.randomAction();
    } else {
      return this.quality.policy(board);
    }
  }

  findEpisode(epsilon) {
    let board = new Board();
    const episode = [];

    while(board.winner() === null) {
      const action = this.findAction(board, epsilon);
      episode.push({ board: board, action: action });
      board = board.step(...action);
    }

    episode.push({ board: board, action: null });
    return episode;
  }


  trainOne(board0, action0, board1, reward) {
    let q0 = this.quality.get(board0, action0);
    const q1 = this.quality.value(board1);
    q0 = q0 + α * (reward + γ * q1 - q0);
    this.quality.set(board0, action0, q0);
  }

  train(episode) {
    const episode_o = [
      episode[0],
      episode[2],
      episode[4],
      episode[5]
    ];

    const episode_x = [
      episode[1],
      episode[3],
      episode[5]
    ];

    this.trainOne(episode_o[2].board, episode_o[2].action, episode_o[3].board, 1);
    this.trainOne(episode_o[1].board, episode_o[1].action, episode_o[2].board, 0);
    this.trainOne(episode_o[0].board, episode_o[0].action, episode_o[1].board, 0);

    this.trainOne(episode_x[1].board, episode_x[1].action, episode_x[2].board, -1);
    this.trainOne(episode_x[0].board, episode_x[0].action, episode_x[1].board, 0);
  }
}
