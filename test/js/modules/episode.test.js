import { Action } from '../../../src/js/modules/action.js';
import { Episode } from '../../../src/js/modules/episode.js';
import { State } from '../../../src/js/modules/state.js';
import { Quality } from '../../../src/js/modules/quality.js';

test('constructor', () => {
  const episode = new Episode();
  expect(episode.events).toEqual([[], []]);
});

describe('find', () => {
  test('epsilon = 1', () => {
    const quality = new Quality();
    const episode = Episode.find(quality, 1);

    const l0 = episode.events[0].length;
    expect(l0).toBeGreaterThanOrEqual(4);
    expect(l0).toBeLessThanOrEqual(6);

    const l1 = episode.events[1].length;
    expect(l1).toBeGreaterThanOrEqual(3);
    expect(l1).toBeLessThanOrEqual(5);

    expect(episode.events[0][l0 - 1].state.winner()).not.toBe(null);
    expect(episode.events[0][l0 - 1].action).toBe(null);

    expect(episode.events[1][l1 - 1].state.winner()).not.toBe(null);
    expect(episode.events[1][l1 - 1].action).toBe(null);
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

    const episode = Episode.find(quality, 0);

    expect(episode.events[0].length).toBe(4);
    expect(episode.events[1].length).toBe(3);

    expect(episode.events[0][0].state.toString()).toBe(state0.toString());
    expect(episode.events[0][1].state.toString()).toBe(state2.toString());
    expect(episode.events[0][2].state.toString()).toBe(state4.toString());
    expect(episode.events[0][3].state.toString()).toBe(state5.toString());

    expect(episode.events[0][0].action).toEqual(action0);
    expect(episode.events[0][1].action).toEqual(action2);
    expect(episode.events[0][2].action).toEqual(action4);
    expect(episode.events[0][3].action).toEqual(null);

    expect(episode.events[1][0].state.toString()).toBe(state1.toString());
    expect(episode.events[1][1].state.toString()).toBe(state3.toString());
    expect(episode.events[1][2].state.toString()).toBe(state5.toString());

    expect(episode.events[1][0].action).toEqual(action1);
    expect(episode.events[1][1].action).toEqual(action3);
    expect(episode.events[1][2].action).toEqual(null);
  });
});

describe('#step', () => {
  test('first 2 steps', () => {
    const episode = new Episode();

    const state0 = new State();
    const action0 = new Action(1, 2);
    episode.step(action0);

    expect(episode.events[0]).toEqual([
      { state: state0, action: action0, reward: 0 }
    ]);
    expect(episode.events[1]).toEqual([]);

    const state1 = state0.step(action0);
    const action1 = new Action(2, 2);
    episode.step(action1);

    expect(episode.events[0]).toEqual([
      { state: state0, action: action0, reward: 0 }
    ]);
    expect(episode.events[1]).toEqual([
      { state: state1, action: action1, reward: -0 }
    ]);
  });

  test('o win', () => {
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

    expect(states[5].marks).toEqual([
      ["o", "x", " "],
      [" ", "o", "x"],
      [" ", " ", "o"]
    ]);

    actions.forEach((action) => {
      episode.step(action);
    });

    expect(episode.events[0]).toEqual([
      { state: states[0], action: actions[0], reward: 0 },
      { state: states[2], action: actions[2], reward: 0 },
      { state: states[4], action: actions[4], reward: 0 },
      { state: states[5], action: null, reward: 1 }
    ]);
    expect(episode.events[1]).toEqual([
      { state: states[1], action: actions[1], reward: -0 },
      { state: states[3], action: actions[3], reward: -0 },
      { state: states[5], action: null, reward: -1 }
    ]);
  });

  test('x win', () => {
    const episode = new Episode();
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

    expect(states[6].marks).toEqual([
      ["o", " ", "x"],
      ["o", "x", "o"],
      ["x", " ", " "]
    ]);

    actions.forEach((action) => {
      episode.step(action);
    });

    expect(episode.events[0]).toEqual([
      { state: states[0], action: actions[0], reward: 0 },
      { state: states[2], action: actions[2], reward: 0 },
      { state: states[4], action: actions[4], reward: 0 },
      { state: states[6], action: null, reward: -1 }
    ]);
    expect(episode.events[1]).toEqual([
      { state: states[1], action: actions[1], reward: -0 },
      { state: states[3], action: actions[3], reward: -0 },
      { state: states[5], action: actions[5], reward: -0 },
      { state: states[6], action: null, reward: 1 }
    ]);
  });

  test('draw', () => {
    const episode = new Episode();
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

    expect(states[9].marks).toEqual([
      ["o", "x", "o"],
      ["o", "x", "o"],
      ["x", "o", "x"]
    ]);

    actions.forEach((action) => {
      episode.step(action);
    });

    expect(episode.events[0]).toEqual([
      { state: states[0], action: actions[0], reward: 0 },
      { state: states[2], action: actions[2], reward: 0 },
      { state: states[4], action: actions[4], reward: 0 },
      { state: states[6], action: actions[6], reward: 0 },
      { state: states[8], action: actions[8], reward: 0 },
      { state: states[9], action: null, reward: 0 }
    ]);
    expect(episode.events[1]).toEqual([
      { state: states[1], action: actions[1], reward: -0 },
      { state: states[3], action: actions[3], reward: -0 },
      { state: states[5], action: actions[5], reward: -0 },
      { state: states[7], action: actions[7], reward: -0 },
      { state: states[9], action: null, reward: -0 }
    ]);
  });
});
