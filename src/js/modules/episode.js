import { State } from './state.js';

export class Episode {
  constructor() {
    this.events = [[], []];
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
      if (state.nextPlayerIndex() == 0) {
        this.events[0].push({ state: state, action: action, reward: reward });
      } else {
        this.events[1].push({ state: state, action: action, reward: -reward });
      }
      return;
    }

    // last state
    this.events[0].push({ state: state, action: null, reward: reward });
    this.events[1].push({ state: state, action: null, reward: -reward });
  }
}
