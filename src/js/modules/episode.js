export class Episode {
  constructor() {
    this.events = [];
  }

  push(state, action) {
    this.events.push({ state: state, action: action });
  }

  episodeO() {
    const l = this.events.length;
    const lastEvent = this.events[l - 1];
    const episode = new Episode();

    this.events.forEach((event, i) => {
      if ((i % 2 == 0) && (i < l - 1)) {
        episode.push(event.state, event.action);
      }
    });

    episode.push(lastEvent.state, lastEvent.action);
    return episode;
  }

  episodeX() {
    const l = this.events.length;
    const lastEvent = this.events[l - 1];
    const episode = new Episode();

    this.events.forEach((event, i) => {
      if ((i % 2 == 1) && (i < l - 1)) {
        episode.push(event.state, event.action);
      }
    });

    episode.push(lastEvent.state, lastEvent.action);
    return episode;

  }
}
