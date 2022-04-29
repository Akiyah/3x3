import { Action } from '../../../src/js/modules/action.js';
import { Game } from '../../../src/js/modules/game.js';
import { State } from '../../../src/js/modules/state.js';
import { Episode } from '../../../src/js/modules/episode.js';

test('constructor', () => {
  const game = new Game();
  expect(game.quality.map).toEqual({});
  expect(game.trainCount).toBe(0);
});

describe('#trainEvent', () => {
  test('reward == 0', () => {
    const game = new Game();
    const state0 = new State();
    const action0 = new Action(1, 1);
    const state1 = state0.step(action0);
    const action1 = new Action(1, 0);
    const state2 = state1.step(action1);
    game.quality.set(state2, new Action(0, 0), 0.5);

    game.trainEvent(state0, action0, state2, 0);
    expect(game.quality.get(state0, action0)).toBe(0.5 * 0.2);

    game.trainEvent(state0, action0, state2, 0);
    expect(game.quality.get(state0, action0)).toBe(0.5 * 0.2 * (1 - 0.2) + 0.5 * 0.2);
  });

  test('reward != 0', () => {
    const game = new Game();
    const state0 = new State([
      ["o", "x", " "],
      [" ", "o", "x"],
      [" ", " ", " "]
    ]);
    const action0 = new Action(2, 2);
    const state1 = state0.step(action0);

    game.trainEvent(state0, action0, state1, 1);
    expect(game.quality.get(state0, action0)).toBe(0.2);

    game.trainEvent(state0, action0, state1, 1);
    expect(game.quality.get(state0, action0)).toBe(0.2 * (1 - 0.2) + 0.2);
  });
});

describe('#trainOnePlayer', () => {
  test('o win', () => {
    const game = new Game();
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

    game.trainOnePlayer([
      { state: states[0], action: actions[0], reward: 0 },
      { state: states[2], action: actions[2], reward: 0 },
      { state: states[4], action: actions[4], reward: 0 },
      { state: states[5], action: null, reward: 1 }
    ]);

    expect(game.quality.get(states[0], actions[0])).toBe(0.2**3);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0.2**2);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(0.2);

    game.trainOnePlayer([
      { state: states[1], action: actions[1], reward: 0 },
      { state: states[3], action: actions[3], reward: 0 },
      { state: states[5], action: null, reward: -1 }
    ]);

    expect(game.quality.get(states[0], actions[0])).toBe(0.2**3);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0.2**2);
    expect(game.quality.get(states[3], actions[3])).toBe(-0.2);
    expect(game.quality.get(states[4], actions[4])).toBe(0.2);
  });

  test('x win', () => {
    const game = new Game();
    const actions = [
      new Action(0, 0),
      new Action(1, 1),
      new Action(0, 1),
      new Action(0, 2),
      new Action(2, 1),
      new Action(2, 0)
    ];

    let state = new State();
    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    game.trainOnePlayer([
      { state: states[0], action: actions[0], reward: 0 },
      { state: states[2], action: actions[2], reward: 0 },
      { state: states[4], action: actions[4], reward: 0 },
      { state: states[6], action: null, reward: -1 }
    ]);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(-0.2);
    expect(game.quality.get(states[5], actions[5])).toBe(0);

    game.trainOnePlayer([
      { state: states[1], action: actions[1], reward: 0 },
      { state: states[3], action: actions[3], reward: 0 },
      { state: states[5], action: actions[5], reward: 0 },
      { state: states[6], action: null, reward: 1 }
    ]);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0.2**3);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0.2**2);
    expect(game.quality.get(states[4], actions[4])).toBe(-0.2);
    expect(game.quality.get(states[5], actions[5])).toBe(0.2);
  });

  test('draw', () => {
    const game = new Game();
    const actions = [
      new Action(0, 0),
      new Action(1, 1),
      new Action(0, 1),
      new Action(0, 2),
      new Action(2, 1),
      new Action(1, 0),
      new Action(1, 2),
      new Action(2, 2),
      new Action(2, 0)
    ];

    let state = new State();
    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    game.trainOnePlayer([
      { state: states[0], action: actions[0], reward: 0 },
      { state: states[2], action: actions[2], reward: 0 },
      { state: states[4], action: actions[4], reward: 0 },
      { state: states[6], action: actions[6], reward: 0 },
      { state: states[8], action: actions[8], reward: 0 },
      { state: states[9], action: null, reward: 0 }
    ]);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(0);
    expect(game.quality.get(states[5], actions[5])).toBe(0);
    expect(game.quality.get(states[6], actions[6])).toBe(0);
    expect(game.quality.get(states[7], actions[7])).toBe(0);
    expect(game.quality.get(states[8], actions[8])).toBe(0);

    game.trainOnePlayer([
      { state: states[1], action: actions[1], reward: 0 },
      { state: states[3], action: actions[3], reward: 0 },
      { state: states[5], action: actions[5], reward: 0 },
      { state: states[7], action: actions[7], reward: 0 },
      { state: states[9], action: null, reward: 0 }
    ]);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(0);
    expect(game.quality.get(states[5], actions[5])).toBe(0);
    expect(game.quality.get(states[6], actions[6])).toBe(0);
    expect(game.quality.get(states[7], actions[7])).toBe(0);
    expect(game.quality.get(states[8], actions[8])).toBe(0);
  });
});

describe('#train', () => {
  test('o win', () => {
    const game = new Game();
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

    const episode = new Episode();
    states.forEach((state, i) => {
      episode.step(actions[i]);
    });

    game.train(episode);

    expect(game.trainCount).toBe(1);

    expect(game.quality.get(states[0], actions[0])).toBe(0.2**3);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0.2**2);
    expect(game.quality.get(states[3], actions[3])).toBe(-0.2);
    expect(game.quality.get(states[4], actions[4])).toBe(0.2);

    game.train(episode);

    expect(game.trainCount).toBe(2);

    expect(game.quality.get(states[0], actions[0])).toBe(0.02720000000000001);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0.10400000000000002);
    expect(game.quality.get(states[3], actions[3])).toBe(-0.2 * (1 - 0.2) - 0.2);
    expect(game.quality.get(states[4], actions[4])).toBe(0.2 * (1 - 0.2) + 0.2);
  });

  test('x win', () => {
    const game = new Game();
    const actions = [
      new Action(0, 0),
      new Action(1, 1),
      new Action(0, 1),
      new Action(0, 2),
      new Action(2, 1),
      new Action(2, 0)
    ];

    let state = new State();
    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    const episode = new Episode();
    states.forEach((state, i) => {
      episode.step(actions[i]);
    });

    game.train(episode);

    expect(game.trainCount).toBe(1);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0.2**3);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0.2**2);
    expect(game.quality.get(states[4], actions[4])).toBe(-0.2);
    expect(game.quality.get(states[5], actions[5])).toBe(0.2);

    game.train(episode);

    expect(game.trainCount).toBe(2);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0.02720000000000001);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0.10400000000000002);
    expect(game.quality.get(states[4], actions[4])).toBe(-0.2 * (1 - 0.2) - 0.2);
    expect(game.quality.get(states[5], actions[5])).toBe(0.2 * (1 - 0.2) + 0.2);
  });

  test('draw', () => {
    const game = new Game();
    const actions = [
      new Action(0, 0),
      new Action(1, 1),
      new Action(0, 1),
      new Action(0, 2),
      new Action(2, 1),
      new Action(1, 0),
      new Action(1, 2),
      new Action(2, 2),
      new Action(2, 0)
    ];

    let state = new State();
    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    const episode = new Episode();
    states.forEach((state, i) => {
      episode.step(actions[i]);
    });

    game.train(episode);

    expect(game.trainCount).toBe(1);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(0);
    expect(game.quality.get(states[5], actions[5])).toBe(0);
    expect(game.quality.get(states[6], actions[6])).toBe(0);
    expect(game.quality.get(states[7], actions[7])).toBe(0);
    expect(game.quality.get(states[8], actions[8])).toBe(0);

    game.train(episode);

    expect(game.trainCount).toBe(2);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(0);
    expect(game.quality.get(states[5], actions[5])).toBe(0);
    expect(game.quality.get(states[6], actions[6])).toBe(0);
    expect(game.quality.get(states[7], actions[7])).toBe(0);
    expect(game.quality.get(states[8], actions[8])).toBe(0);
  });
});
