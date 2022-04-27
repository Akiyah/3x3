export class Episode {
  constructor() {
    this.events = [];
  }

  push(state, action, reward) {
    this.events.push({ state: state, action: action, reward: reward });
  }

  playerEpisode(player) {
    const l = this.events.length;
    const lastEvent = this.events[l - 1];
    const episode = new Episode();
    const b = (player == "o" ? 0 : 1);
    const sign = (player == "o" ? 1 : -1);

    this.events.forEach((event, i) => {
      if (i < l - 1) {
        if (i % 2 == b) {
          episode.push(event.state, event.action, event.reward * sign);
        }
      }
    });

    episode.push(lastEvent.state, lastEvent.action, lastEvent.reward * sign);
    return episode;
  }
}
