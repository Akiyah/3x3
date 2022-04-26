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
  episode.push(state0, action0);

  expect(episode.events).toEqual([
    { state: state0, action: action0 }
  ]);

  const state1 = state0.step(action0);
  const action1 = new Action(2, 2);
  episode.push(state1, action1);

  expect(episode.events).toEqual([
    { state: state0, action: action0 },
    { state: state1, action: action1 }
  ]);
});

describe('#episodeO/#episodeX', () => {
  const episode = new Episode();
  const actions = [
    new Action(1, 1),
    new Action(1, 0),
    new Action(0, 0),
    new Action(2, 1),
    new Action(2, 2)
  ];

  let state = new State();
  const states = [state].concat(actions.map((action) => {
    state = state.step(action);
    return state;
  }));

  const l = actions.length;
  for (let i = 0; i < l; i++) {
    episode.push(states[i], actions[i]);
  }
  episode.push(states[l], null);

  expect(episode.episodeO()).toEqual([
    { state: states[0], action: actions[0] },
    { state: states[2], action: actions[2] },
    { state: states[4], action: actions[4] },
    { state: states[5], action: null }
  ]);

  expect(episode.episodeX()).toEqual([
    { state: states[1], action: actions[1] },
    { state: states[3], action: actions[3] },
    { state: states[5], action: null }
  ]);
});
