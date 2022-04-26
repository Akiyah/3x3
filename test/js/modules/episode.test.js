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
