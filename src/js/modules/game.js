import { State } from './state.js';
import { Quality } from './quality.js';

const α = 0.2;
const γ = 1;

export class Game {
  constructor(quality = new Quality()) {
    this.quality = quality;
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
    const episode = [];

    while(state.winner() === null) {
      const action = this.findAction(state, epsilon);
      episode.push({ state: state, action: action });
      state = state.step(action);
    }

    episode.push({ state: state, action: null });
    return episode;
  }


  trainEvent(state0, action0, state1, reward) {
    let q0 = this.quality.get(state0, action0);
    const q1 = this.quality.value(state1);
    q0 = q0 + α * (reward + γ * q1 - q0);
    this.quality.set(state0, action0, q0);
  }

  train(episode) {
    const l = episode.length;
    const eventLast = episode[l - 1];
    const stateLast = eventLast.state;

    let rewardO = 0;
    let rewardX = 0;

    if (stateLast.winner() == "o") {
      rewardO = 1;
      rewardX = -1;
    }

    if (stateLast.winner() == "x") {
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
      this.trainEvent(event0.state, event0.action, event1.state, reward);
    }

    for (let i = 0; i < episodeX.length - 1; i++) {
      const event0 = episodeX[episodeX.length - 2 - i];
      const event1 = episodeX[episodeX.length - 1 - i];
      const reward = (i == 0) ? rewardX : 0;
      this.trainEvent(event0.state, event0.action, event1.state, reward);
    }
  }
}
