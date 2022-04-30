export class Episode {
  constructor(state) {
    this.events = [[], []];
    this.state = state;
  }

  static find(state, quality, epsilon) {
    const episode = new Episode(state);

    while(episode.state.winner() === null) {
      const action = quality.findAction(episode.state, epsilon);
      episode.step(action);
    }

    return episode;
  }

  step(action) {
    const reward = this.state.reward();
    let state = this.state;

    const i = state.nextPlayerIndex();
    this.events[i].push({
      state: state,
      action: action,
      reward: i == 0 ? reward : -reward
    });

    state = state.step(action);
    this.state = state;

    if (state.winner()) {
      // last state
      this.events[0].push({ state: state, action: null, reward: state.reward() });
      this.events[1].push({ state: state, action: null, reward: -state.reward() });
    }
  }

  eachStep(callback) {
    this.events.forEach((events) => {
      const eventsR = events.slice().reverse();

      eventsR.forEach((event0, i) => {
        if (0 < i) {
          const event1 = eventsR[i - 1];
          callback(event0, event1);
        }
      });
    });
  }
}
