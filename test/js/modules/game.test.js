import { Game } from '../../../src/js/modules/game.js';
import { State } from '../../../src/js/modules/state.js';

test('constructor', () => {
  const game = new Game();
  expect(game.quality.map).toEqual({});
});

describe('#findAction', () => {
  test('epsilon = 1', () => {
    const game = new Game();
    const state = new State();
    const action = game.findAction(state, 1);
    expect([0, 1, 2]).toContain(action[0]);
    expect([0, 1, 2]).toContain(action[1]);
  });

  test('epsilon = 0', () => {
    const game = new Game();
    const state = new State();
    game.quality.set(state, [2, 1], 1);

    const action = game.findAction(state, 0);
    expect(action).toEqual([2, 1]);
  });
});

describe('#findEpisode', () => {
  test('epsilon = 1', () => {
    const game = new Game();
    const episode = game.findEpisode(1);

    const l = episode.length;
    expect(l).toBeGreaterThanOrEqual(6);
    expect(l).toBeLessThanOrEqual(10);

    for (let s = 0; s < l - 1; s++) {
      const state0 = episode[s].state;
      const state1 = episode[s + 1].state;
      const nextState = state0.step(episode[s].action);

      expect(state0.winner()).toBe(null);
      expect(nextState.toString()).toBe(state1.toString());
    }
    expect(episode[l - 1].state.winner()).not.toBe(null);
    expect(episode[l - 1].action).toBe(null);
  });

  test('epsilon = 0', () => {
    const game = new Game();
    const state0 = new State([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"]
    ]);
    const action0 = [1, 1];
    const state1 = new State([
      ["_", "_", "_"],
      ["_", "o", "_"],
      ["_", "_", "_"]
    ]);
    const action1 = [1, 0];
    const state2 = new State([
      ["_", "x", "_"],
      ["_", "o", "_"],
      ["_", "_", "_"]
    ]);
    const action2 = [0, 0];
    const state3 = new State([
      ["o", "x", "_"],
      ["_", "o", "_"],
      ["_", "_", "_"]
    ]);
    const action3 = [2, 1];
    const state4 = new State([
      ["o", "x", "_"],
      ["_", "o", "x"],
      ["_", "_", "_"]
    ]);
    const action4 = [2, 2];
    const state5 = new State([
      ["o", "x", "_"],
      ["_", "o", "x"],
      ["_", "_", "o"]
    ]);

    game.quality.set(state0, action0, 1);
    game.quality.set(state1, action1, 1);
    game.quality.set(state2, action2, 1);
    game.quality.set(state3, action3, 1);
    game.quality.set(state4, action4, 1);

    const episode = game.findEpisode(0);

    expect(episode.length).toBe(6);

    expect(episode[0].state.toString()).toBe(state0.toString());
    expect(episode[1].state.toString()).toBe(state1.toString());
    expect(episode[2].state.toString()).toBe(state2.toString());
    expect(episode[3].state.toString()).toBe(state3.toString());
    expect(episode[4].state.toString()).toBe(state4.toString());
    expect(episode[5].state.toString()).toBe(state5.toString());

    expect(episode[0].action).toEqual(action0);
    expect(episode[1].action).toEqual(action1);
    expect(episode[2].action).toEqual(action2);
    expect(episode[3].action).toEqual(action3);
    expect(episode[4].action).toEqual(action4);
    expect(episode[5].action).toEqual(null);
  });
});


describe('#trainOne', () => {
  test('reward == 0', () => {
    const game = new Game();
    const state0 = new State();
    const action0 = [1, 1];
    const state1 = state0.step(action0);
    const action1 = [1, 0];
    const state2 = state1.step(action1);
    game.quality.set(state2, [0, 0], 0.5);

    game.trainOne(state0, action0, state2, 0);
    expect(game.quality.get(state0, action0)).toBe(0.5 * 0.2);

    game.trainOne(state0, action0, state2, 0);
    expect(game.quality.get(state0, action0)).toBe(0.5 * 0.2 * (1 - 0.2) + 0.5 * 0.2);
  });

  test('reward != 0', () => {
    const game = new Game();
    const state0 = new State([
      ["o", "x", "_"],
      ["_", "o", "x"],
      ["_", "_", "_"]
    ]);
    const action0 = [2, 2];
    const state1 = state0.step(action0);

    game.trainOne(state0, action0, state1, 1);
    expect(game.quality.get(state0, action0)).toBe(0.2);

    game.trainOne(state0, action0, state1, 1);
    expect(game.quality.get(state0, action0)).toBe(0.2 * (1 - 0.2) + 0.2);
  });
});

describe('#train', () => {
  test('o win', () => {
    const game = new Game();
    const actions = [
      [1, 1],
      [1, 0],
      [0, 0],
      [2, 1],
      [2, 2]
    ];

    let state = new State();
    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    const episode = states.map((state, i) => {
      return { state: state, action: actions[i] };
    });

    game.train(episode);

    expect(game.quality.get(states[0], actions[0])).toBe(0.2**3);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0.2**2);
    expect(game.quality.get(states[3], actions[3])).toBe(-0.2);
    expect(game.quality.get(states[4], actions[4])).toBe(0.2);

    game.train(episode);

    expect(game.quality.get(states[0], actions[0])).toBe(0.02720000000000001);
    expect(game.quality.get(states[1], actions[1])).toBe(0);
    expect(game.quality.get(states[2], actions[2])).toBe(0.10400000000000002);
    expect(game.quality.get(states[3], actions[3])).toBe(-0.2 * (1 - 0.2) - 0.2);
    expect(game.quality.get(states[4], actions[4])).toBe(0.2 * (1 - 0.2) + 0.2);
  });

  test('x win', () => {
    const game = new Game();
    const actions = [
      [0, 0],
      [1, 1],
      [0, 1],
      [0, 2],
      [2, 1],
      [2, 0]
    ];

    let state = new State();
    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    const episode = states.map((state, i) => {
      return { state: state, action: actions[i] };
    });

    game.train(episode);

    expect(game.quality.get(states[0], actions[0])).toBe(0);
    expect(game.quality.get(states[1], actions[1])).toBe(0.2**3);
    expect(game.quality.get(states[2], actions[2])).toBe(0);
    expect(game.quality.get(states[3], actions[3])).toBe(0.2**2);
    expect(game.quality.get(states[4], actions[4])).toBe(-0.2);
    expect(game.quality.get(states[5], actions[5])).toBe(0.2);

    game.train(episode);

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
      [0, 0],
      [1, 1],
      [0, 1],
      [0, 2],
      [2, 1],
      [1, 0],
      [1, 2],
      [2, 2],
      [2, 0]
    ];

    let state = new State();
    const states = [state].concat(actions.map((action) => {
      state = state.step(action);
      return state;
    }));

    const episode = states.map((state, i) => {
      return { state: state, action: actions[i] };
    });

    game.train(episode);

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

/*
test('train x 10000', () => {
  const game = new Game();

  for (let j = 0; j < 10; j++) {
    let output = {};
    output["o"] = 0;
    output["x"] = 0;
    output["-"] = 0;
    output["null"] = 0;

    for (let i = 0; i < 10000; i++) {
      const episode = game.findEpisode(0.1);
      game.train(episode);

      const event = episode[episode.length-1];
      const state = event.state;
      if (state.winner()) {
        output[state.winner()]++;
      } else {
        output["null"]++;
      }
    }
    console.log(output);
  }


  const episode = game.findEpisode(0);
  console.log(episode);
  episode.forEach((event) => {
    console.log(event.state.toString());
    console.log(event.action);
    console.log(game.quality.m(event.state));
  });

});
*/