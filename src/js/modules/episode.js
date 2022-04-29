import { State } from './state.js';

export class Episode {
  constructor() {
    this.eventsO = [];
    this.eventsX = [];
  }

  static find(quality, epsilon) {
    let state = new State();
    const episode = new Episode();

    while(state.winner() === null) {
      const action = quality.findAction(state, epsilon);
      episode.push(state, action, state.reward());
      state = state.step(action);
    }

    episode.push(state, null, state.reward());
    return episode;
  }

  push(state, action, reward) {
    if (!state.winner()) {
      if (state.nextPlayer() == "o") {
        this.eventsO.push({ state: state, action: action, reward: reward });
      } else {
        this.eventsX.push({ state: state, action: action, reward: -reward });
      }
      return;
    }

    const lO = this.eventsO.length;
    const lX = this.eventsX.length;

    this.eventsO.push({ state: state, action: null, reward: reward });
    this.eventsX.push({ state: state, action: null, reward: -reward });
  }

  playerEpisode(player) {
    if (player == "o") {
      return this.eventsO;
    }
    return this.eventsX;
  }
}
