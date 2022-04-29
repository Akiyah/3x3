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

    const episodeO = new Episode();
    episodeO.push(states[0], actions[0], 0)
    episodeO.push(states[2], actions[2], 0)
    episodeO.push(states[4], actions[4], 0)
    episodeO.push(states[5], null, 1)

    const episodeX = new Episode();
    episodeX.push(states[1], actions[1], 0)
    episodeX.push(states[3], actions[3], 0)
    episodeX.push(states[5], null, -1)

    game.trainOnePlayer(episodeO);

    expect(game.quality.get(states[0], actions[0])).toBe(0.2**3);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0.2**2);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(0.2);

    game.trainOnePlayer(episodeX);

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

    const episodeO = new Episode();
    episodeO.push(states[0], actions[0], 0)
    episodeO.push(states[2], actions[2], 0)
    episodeO.push(states[4], actions[4], 0)
    episodeO.push(states[6], null, -1)

    const episodeX = new Episode();
    episodeX.push(states[1], actions[1], 0)
    episodeX.push(states[3], actions[3], 0)
    episodeX.push(states[5], actions[5], 0)
    episodeX.push(states[6], null, 1)

    game.trainOnePlayer(episodeO);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(-0.2);
    expect(game.quality.get(states[5], actions[5])).toBe(0);

    game.trainOnePlayer(episodeX);

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

    const episodeO = new Episode();
    episodeO.push(states[0], actions[0], 0)
    episodeO.push(states[2], actions[2], 0)
    episodeO.push(states[4], actions[4], 0)
    episodeO.push(states[6], actions[6], 0)
    episodeO.push(states[8], actions[8], 0)
    episodeO.push(states[9], null, 0)

    const episodeX = new Episode();
    episodeX.push(states[1], actions[1], 0)
    episodeX.push(states[3], actions[3], 0)
    episodeX.push(states[5], actions[5], 0)
    episodeX.push(states[7], actions[7], 0)
    episodeX.push(states[9], null, 0)

    game.trainOnePlayer(episodeO);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0);
    expect(game.quality.get(states[4], actions[4])).toBe(0);
    expect(game.quality.get(states[5], actions[5])).toBe(0);
    expect(game.quality.get(states[6], actions[6])).toBe(0);
    expect(game.quality.get(states[7], actions[7])).toBe(0);
    expect(game.quality.get(states[8], actions[8])).toBe(0);

    game.trainOnePlayer(episodeX);

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
      episode.push(state, actions[i], i == states.length - 1 ? 1 : 0);
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
      episode.push(state, actions[i], i == states.length - 1 ? -1 : 0);
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
      episode.push(state, actions[i], 0);
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
