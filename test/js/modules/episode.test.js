import { Action } from '../../../src/js/modules/action.js';
import { Episode } from '../../../src/js/modules/episode.js';
import { State } from '../../../src/js/modules/state.js';
import { Quality } from '../../../src/js/modules/quality.js';

test('constructor', () => {
  const episode = new Episode();
  expect(episode.events).toEqual([]);
});

describe('findAction', () => {
  test('epsilon = 1', () => {
    const state = new State();
    const quuality = new Quality();

    const action = Episode.findAction(state, 1, quuality);
    expect([0, 1, 2]).toContain(action.x);
    expect([0, 1, 2]).toContain(action.y);
  });

  test('epsilon = 0', () => {
    const state = new State();
    const quality = new Quality();
    quality.set(state, new Action(2, 1), 1);

    const action = Episode.findAction(state, 0, quality);
    expect(action).toEqual(new Action(2, 1));
  });
});

describe('find', () => {
  test('epsilon = 1', () => {
    const quality = new Quality();
    const episode = Episode.find(1, quality);

    const l = episode.events.length;
    expect(l).toBeGreaterThanOrEqual(6);
    expect(l).toBeLessThanOrEqual(10);

    for (let s = 0; s < l - 1; s++) {
      const state0 = episode.events[s].state;
      const state1 = episode.events[s + 1].state;
      const nextState = state0.step(episode.events[s].action);

      expect(state0.winner()).toBe(null);
      expect(nextState.toString()).toBe(state1.toString());
    }
    expect(episode.events[l - 1].state.winner()).not.toBe(null);
    expect(episode.events[l - 1].action).toBe(null);
  });

  test('epsilon = 0', () => {
    const quality = new Quality();
    const state0 = new State([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "]
    ]);
    const action0 = new Action(1, 1);
    const state1 = new State([
      [" ", " ", " "],
      [" ", "o", " "],
      [" ", " ", " "]
    ]);
    const action1 = new Action(1, 0);
    const state2 = new State([
      [" ", "x", " "],
      [" ", "o", " "],
      [" ", " ", " "]
    ]);
    const action2 = new Action(0, 0);
    const state3 = new State([
      ["o", "x", " "],
      [" ", "o", " "],
      [" ", " ", " "]
    ]);
    const action3 = new Action(2, 1);
    const state4 = new State([
      ["o", "x", " "],
      [" ", "o", "x"],
      [" ", " ", " "]
    ]);
    const action4 = new Action(2, 2);
    const state5 = new State([
      ["o", "x", " "],
      [" ", "o", "x"],
      [" ", " ", "o"]
    ]);

    quality.set(state0, action0, 1);
    quality.set(state1, action1, 1);
    quality.set(state2, action2, 1);
    quality.set(state3, action3, 1);
    quality.set(state4, action4, 1);

    const episode = Episode.find(0, quality);

    expect(episode.events.length).toBe(6);

    expect(episode.events[0].state.toString()).toBe(state0.toString());
    expect(episode.events[1].state.toString()).toBe(state1.toString());
    expect(episode.events[2].state.toString()).toBe(state2.toString());
    expect(episode.events[3].state.toString()).toBe(state3.toString());
    expect(episode.events[4].state.toString()).toBe(state4.toString());
    expect(episode.events[5].state.toString()).toBe(state5.toString());

    expect(episode.events[0].action).toEqual(action0);
    expect(episode.events[1].action).toEqual(action1);
    expect(episode.events[2].action).toEqual(action2);
    expect(episode.events[3].action).toEqual(action3);
    expect(episode.events[4].action).toEqual(action4);
    expect(episode.events[5].action).toEqual(null);
  });
});

test('#push', () => {
  const episode = new Episode();

  const state0 = new State();
  const action0 = new Action(1, 2);
  episode.push(state0, action0, 0);

  expect(episode.events).toEqual([
    { state: state0, action: action0, reward: 0 }
  ]);

  const state1 = state0.step(action0);
  const action1 = new Action(2, 2);
  episode.push(state1, action1, 1);

  expect(episode.events).toEqual([
    { state: state0, action: action0, reward: 0 },
    { state: state1, action: action1, reward: 1 }
  ]);
});

describe('#playerEpisode', () => {
  const episode = new Episode();
  const actions = [
    new Action(0, 0),
    new Action(1, 0),
    new Action(2, 0),
    new Action(0, 1),
    new Action(1, 1),
    new Action(2, 1)
  ];

  const rewards = [1, 2, 3, 4, 5, 6];

  const states = [];
  states[0] = new State();
  states[1] = states[0].step(actions[0]);
  states[2] = states[1].step(actions[1]);
  states[3] = states[2].step(actions[2]);
  states[4] = states[3].step(actions[3]);
  states[5] = states[4].step(actions[4]);

  for (let i = 0; i < 6; i++) {
    episode.push(states[i], actions[i], rewards[i]);
  }

  expect(episode.playerEpisode("o").events).toEqual([
    { state: states[0], action: actions[0], reward: rewards[0] },
    { state: states[2], action: actions[2], reward: rewards[2] },
    { state: states[4], action: actions[4], reward: rewards[4] },
    { state: states[5], action: actions[5], reward: rewards[5] }
  ]);

  expect(episode.playerEpisode("x").events).toEqual([
    { state: states[1], action: actions[1], reward: -rewards[1] },
    { state: states[3], action: actions[3], reward: -rewards[3] },
    { state: states[5], action: actions[5], reward: -rewards[5] }
  ]);
});
