import { Action } from '../../../src/js/modules/action.js';
import { Quality } from '../../../src/js/modules/quality.js';
import { State } from '../../../src/js/modules/state.js';
import { Episode } from '../../../src/js/modules/episode.js';

test('constructor', () => {
  const quality = new Quality();
  expect(quality.table).toEqual({});
  expect(quality.trainCount).toBe(0);
});

test('#get/#set/#m', () => {
  const quality = new Quality();
  const state = new State([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);

  expect(quality.m(state)).toEqual({});

  expect(quality.get(state, new Action(0, 0))).toBe(0);
  expect(quality.get(state, new Action(1, 0))).toBe(0);
  expect(quality.get(state, new Action(0, 1))).toBe(0); // not enable action
  expect(quality.get(state, new Action(2, 1))).toBe(0);

  quality.set(state, new Action(0, 0), 0.1);
  quality.set(state, new Action(1, 0), 0.2);
  quality.set(state, new Action(2, 1), 0.3);

  expect(quality.get(state, new Action(0, 0))).toBe(0.1);
  expect(quality.get(state, new Action(1, 0))).toBe(0.2);
  expect(quality.get(state, new Action(0, 1))).toBe(0); // not enable action
  expect(quality.get(state, new Action(2, 1))).toBe(0.3);

  expect(quality.m(state)).toEqual({
    "[0, 0]": 0.1,
    "[1, 0]": 0.2,
    "[2, 1]": 0.3
  });
});

describe('#value', () => {
  test('exist actions', () => {
    const quality = new Quality();
    const state = new State([
      [" ", " ", " "],
      ["x", " ", " "],
      [" ", "o", " "]
    ]);

    expect(quality.value(state)).toEqual(0);

    quality.set(state, new Action(0, 0), 0.1);
    quality.set(state, new Action(1, 0), 0.2);
    quality.set(state, new Action(2, 1), 0.3);

    expect(quality.value(state)).toEqual(0.3);
  });

  test('exist minus actions', () => {
    const quality = new Quality();
    const state = new State([
      [" ", " ", " "],
      ["x", " ", " "],
      [" ", "o", " "]
    ]);

    expect(quality.value(state)).toEqual(0);

    quality.set(state, new Action(0, 0), -0.1);
    quality.set(state, new Action(1, 0), -0.2);
    quality.set(state, new Action(2, 1), -0.3);

    expect(quality.value(state)).toEqual(0);
  });

  test('no actions', () => {
    const quality = new Quality();
    const state = new State([
      ["o", "x", "o"],
      ["o", "x", "o"],
      ["x", "o", "x"]
    ]);

    expect(quality.value(state)).toEqual(0);
  });
});

test('#policy', () => {
  const quality = new Quality();
  const state = new State([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);

  expect(quality.policy(state)).toEqual(new Action(0, 0));

  quality.set(state, new Action(0, 0), 0.1);
  quality.set(state, new Action(1, 0), 0.2);
  quality.set(state, new Action(2, 1), 0.3);

  expect(quality.policy(state)).toEqual(new Action(2, 1));
});

describe('#findAction', () => {
  test('epsilon = 1', () => {
    const quality = new Quality();
    const state = new State();
    const action = quality.findAction(state, 1);
    expect([0, 1, 2]).toContain(action.x);
    expect([0, 1, 2]).toContain(action.y);
  });

  test('epsilon = 0', () => {
    const quality = new Quality();
    const state = new State();
    quality.set(state, new Action(2, 1), 1);

    const action = quality.findAction(state, 0);
    expect(action).toEqual(new Action(2, 1));
  });
});

describe('#trainEvent', () => {
  test('reward == 0', () => {
    const quality = new Quality();
    const state0 = new State();
    const action0 = new Action(1, 1);
    const state1 = state0.step(action0);
    const action1 = new Action(1, 0);
    const state2 = state1.step(action1);
    quality.set(state2, new Action(0, 0), 0.5);

    quality.trainEvent(state0, action0, state2, 0);
    expect(quality.get(state0, action0)).toBe(0.5 * 0.2);

    quality.trainEvent(state0, action0, state2, 0);
    expect(quality.get(state0, action0)).toBe(0.5 * 0.2 * (1 - 0.2) + 0.5 * 0.2);
  });

  test('reward != 0', () => {
    const quality = new Quality();
    const state0 = new State([
      ["o", "x", " "],
      [" ", "o", "x"],
      [" ", " ", " "]
    ]);
    const action0 = new Action(2, 2);
    const state1 = state0.step(action0);

    quality.trainEvent(state0, action0, state1, 1);
    expect(quality.get(state0, action0)).toBe(0.2);

    quality.trainEvent(state0, action0, state1, 1);
    expect(quality.get(state0, action0)).toBe(0.2 * (1 - 0.2) + 0.2);
  });
});

describe('#train', () => {
  test('o win', () => {
    const quality = new Quality();
    const actions = [
      new Action(1, 1),
      new Action(1, 0),
      new Action(0, 0),
      new Action(2, 1),
      new Action(2, 2)
    ];

    let state = new State();
    const episode = new Episode(state);
    actions.forEach((action) => {
      episode.step(action);
    });

    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    quality.train(episode);

    expect(quality.trainCount).toBe(1);

    expect(quality.get(states[0], actions[0])).toBe(0.2**3);
    expect(quality.get(states[1], actions[1])).toBe(0);
    expect(quality.get(states[2], actions[2])).toBe(0.2**2);
    expect(quality.get(states[3], actions[3])).toBe(-0.2);
    expect(quality.get(states[4], actions[4])).toBe(0.2);

    quality.train(episode);

    expect(quality.trainCount).toBe(2);

    expect(quality.get(states[0], actions[0])).toBe(0.02720000000000001);
    expect(quality.get(states[1], actions[1])).toBe(0);
    expect(quality.get(states[2], actions[2])).toBe(0.10400000000000002);
    expect(quality.get(states[3], actions[3])).toBe(-0.2 * (1 - 0.2) - 0.2);
    expect(quality.get(states[4], actions[4])).toBe(0.2 * (1 - 0.2) + 0.2);
  });

  test('x win', () => {
    const quality = new Quality();
    const actions = [
      new Action(0, 0),
      new Action(1, 1),
      new Action(0, 1),
      new Action(0, 2),
      new Action(2, 1),
      new Action(2, 0)
    ];

    let state = new State();
    const episode = new Episode(state);
    actions.forEach((action) => {
      episode.step(action);
    });

    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    quality.train(episode);

    expect(quality.trainCount).toBe(1);

    expect(quality.get(states[0], actions[0])).toBe(0);
    expect(quality.get(states[1], actions[1])).toBe(0.2**3);
    expect(quality.get(states[2], actions[2])).toBe(0);
    expect(quality.get(states[3], actions[3])).toBe(0.2**2);
    expect(quality.get(states[4], actions[4])).toBe(-0.2);
    expect(quality.get(states[5], actions[5])).toBe(0.2);

    quality.train(episode);

    expect(quality.trainCount).toBe(2);

    expect(quality.get(states[0], actions[0])).toBe(0);
    expect(quality.get(states[1], actions[1])).toBe(0.02720000000000001);
    expect(quality.get(states[2], actions[2])).toBe(0);
    expect(quality.get(states[3], actions[3])).toBe(0.10400000000000002);
    expect(quality.get(states[4], actions[4])).toBe(-0.2 * (1 - 0.2) - 0.2);
    expect(quality.get(states[5], actions[5])).toBe(0.2 * (1 - 0.2) + 0.2);
  });

  test('draw', () => {
    const quality = new Quality();
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
    const episode = new Episode(state);
    actions.forEach((action) => {
      episode.step(action);
    });

    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    quality.train(episode);

    expect(quality.trainCount).toBe(1);

    expect(quality.get(states[0], actions[0])).toBe(0);
    expect(quality.get(states[1], actions[1])).toBe(0);
    expect(quality.get(states[2], actions[2])).toBe(0);
    expect(quality.get(states[3], actions[3])).toBe(0);
    expect(quality.get(states[4], actions[4])).toBe(0);
    expect(quality.get(states[5], actions[5])).toBe(0);
    expect(quality.get(states[6], actions[6])).toBe(0);
    expect(quality.get(states[7], actions[7])).toBe(0);
    expect(quality.get(states[8], actions[8])).toBe(0);

    quality.train(episode);

    expect(quality.trainCount).toBe(2);

    expect(quality.get(states[0], actions[0])).toBe(0);
    expect(quality.get(states[1], actions[1])).toBe(0);
    expect(quality.get(states[2], actions[2])).toBe(0);
    expect(quality.get(states[3], actions[3])).toBe(0);
    expect(quality.get(states[4], actions[4])).toBe(0);
    expect(quality.get(states[5], actions[5])).toBe(0);
    expect(quality.get(states[6], actions[6])).toBe(0);
    expect(quality.get(states[7], actions[7])).toBe(0);
    expect(quality.get(states[8], actions[8])).toBe(0);
  });
});

test('#qTableCount', () => {
  const quality = new Quality();
  const state0 = new State();
  const state1 = new State([
    [" ", " ", " "],
    ["x", " ", " "],
    [" ", "o", " "]
  ]);

  expect(quality.qTableCount()).toBe(0);

  quality.set(state0, new Action(0, 0), 0.1);
  expect(quality.qTableCount()).toBe(1);

  quality.set(state0, new Action(1, 0), 0.2);
  expect(quality.qTableCount()).toBe(2);

  quality.set(state1, new Action(2, 1), 0.3);
  expect(quality.qTableCount()).toBe(3);

  quality.set(state1, new Action(2, 2), 0);
  expect(quality.qTableCount()).toBe(4);
});
