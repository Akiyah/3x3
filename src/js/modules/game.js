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
      board = board.step(action);
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
    const l = episode.length;
    const eventLast = episode[l - 1];
    const boardLast = eventLast.board;

    let rewardO = 0;
    let rewardX = 0;

    if (boardLast.winner() == "o") {
      rewardO = 1;
      rewardX = -1;
    }

    if (boardLast.winner() == "x") {
      rewardO = -1;
      rewardX = 1;
    }

    const episodeO = episode.filter((_event, i) => {
      return (i % 2 == 0) && (i < l - 1);
    }).concat(eventLast);

    const episodeX = episode.filter((_event, i) => {
      return (i % 2 == 1) && (i < l - 1);
    }).concat(eventLast);

    for (let i = 0; i < episodeO.length - 1; i++) {
      const event0 = episodeO[episodeO.length - 2 - i];
      const event1 = episodeO[episodeO.length - 1 - i];
      const reward = (i == 0) ? rewardO : 0;
      this.trainOne(event0.board, event0.action, event1.board, reward);
    }

    for (let i = 0; i < episodeX.length - 1; i++) {
      const event0 = episodeX[episodeX.length - 2 - i];
      const event1 = episodeX[episodeX.length - 1 - i];
      const reward = (i == 0) ? rewardX : 0;
      this.trainOne(event0.board, event0.action, event1.board, reward);
    }
  }
}
