import { Quality } from './quality.js';

const α = 0.2;
const γ = 1;

export class Game {
  constructor(quality = new Quality()) {
    this.quality = quality;
    this.trainCount = 0;
  }

  trainEvent(state0, action0, state1, reward) {
    let q0 = this.quality.get(state0, action0);
    const q1 = this.quality.value(state1);
    q0 = q0 + α * (reward + γ * q1 - q0);
    this.quality.set(state0, action0, q0);
  }

  train(episode) {
    episode.eachStep((event0, event1) => {
      this.trainEvent(event0.state, event0.action, event1.state, event1.reward);
    });
    this.trainCount++;
  }
}
