import { State } from './state.js';
import { Quality } from './quality.js';
import { Episode } from './episode.js';

const α = 0.2;
const γ = 1;

export class Game {
  constructor(quality = new Quality()) {
    this.quality = quality;
    this.trainCount = 0;
  }

  findAction(state, epsilon) {
    if (Math.random() < epsilon) {
      return state.randomAction();
    } else {
      return this.quality.policy(state);
    }
  }

  findEpisode(epsilon) {
    let state = new State();
    const episode = new Episode();

    while(state.winner() === null) {
      const action = this.findAction(state, epsilon);
      episode.push(state, action);
      state = state.step(action);
    }

    episode.push(state, null);
    return episode;
  }

  trainEvent(state0, action0, state1, reward) {
    let q0 = this.quality.get(state0, action0);
    const q1 = this.quality.value(state1);
    q0 = q0 + α * (reward + γ * q1 - q0);
    this.quality.set(state0, action0, q0);
  }

  trainOnePlayer(episode, player) {
    const l = episode.length;
    const eventLast = episode[l - 1];
    const stateLast = eventLast.state;

    let reward = 0;
    if (stateLast.winner() == "-") {
      reward = 0;
    } else if (stateLast.winner() == player) {
      reward = 1;
    } else {
      reward = -1;
    }

    for (let i = 0; i < l - 1; i++) {
      const event0 = episode[l - 2 - i];
      const event1 = episode[l - 1 - i];
      const r = (i == 0) ? reward : 0;
      this.trainEvent(event0.state, event0.action, event1.state, r);
    }
  }

  train(episode) {
    this.trainOnePlayer(episode.episodeO(), "o");
    this.trainOnePlayer(episode.episodeX(), "x");

    this.trainCount++;
  }
}
