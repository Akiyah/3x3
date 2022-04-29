import { State } from './state.js';

export class Episode {
  constructor() {
    this.events = [[], []];
    this.state = new State();
  }

  static find(quality, epsilon) {
    let state = new State();
    const episode = new Episode();

    while(state.winner() === null) {
      const action = quality.findAction(state, epsilon);
      episode.step(action);
      state = state.step(action);
    }

    episode.step(null);
    return episode;
  }

  step(action) {
    const reward = this.state.reward();
    const state = this.state;

    if (!state.winner()) {
      const i = state.nextPlayerIndex();
      this.events[i].push({
        state: state,
        action: action,
        reward: i == 0 ? reward : -reward
      });

      this.state = state.step(action);
      return;
    }

    // last state
    this.events[0].push({ state: state, action: null, reward: state.reward() });
    this.events[1].push({ state: state, action: null, reward: -state.reward() });
  }
}
