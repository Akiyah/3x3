import { Action } from '../../../src/js/modules/action.js';
import { Episode } from '../../../src/js/modules/episode.js';
import { State } from '../../../src/js/modules/state.js';

test('constructor', () => {
  const episode = new Episode();
  expect(episode.events).toEqual([]);
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
