import { Action } from '../../../src/js/modules/action.js';

test('constructor', () => {
  const action = new Action(1, 2);

  expect(action.x).toBe(1);
  expect(action.y).toBe(2);
});

test('#toString', () => {
  const action = new Action(1, 2);

  expect(action.toString()).toBe("[1, 2]");
});

test('.create', () => {
  const action = Action.create("[1, 2]");

  expect(action.x).toBe(1);
  expect(action.y).toBe(2);
});
