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

    return this.events.filter((_event, i) => {
      return (i % 2 == 0) && (i < l - 1);
    }).concat(lastEvent);
  }

  episodeX() {
    const l = this.events.length;
    const lastEvent = this.events[l - 1];

    return this.events.filter((_event, i) => {
      return (i % 2 == 1) && (i < l - 1);
    }).concat(lastEvent);
  }
}
