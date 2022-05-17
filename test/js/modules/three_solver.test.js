import { ThreeSolver } from '../../../src/js/modules/three_solver.js';

test('#init', () => {
  const solver = new ThreeSolver();
  const results = solver.init();

  const keys = Object.keys(results);
  const key = keys[keys.length - 1];

  expect(keys.length).toBe(128170);
  expect(key).toBe(
    "   " + "\n" +
    "xox" + "\n" +
    "oxo" + "\n" +
    "000" + "\n" +
    "654" + "\n" +
    "321"
  );
  expect(results[key]).toBe(0);

  const key2 =
    "x  " + "\n" +
    " x " + "\n" +
    "ooo" + "\n" +
    "500" + "\n" +
    "030" + "\n" +
    "642"
  expect(results[key2]).toBe(1);

  const key3 =
    "o  " + "\n" +
    " oo" + "\n" +
    "xxx" + "\n" +
    "500" + "\n" +
    "031" + "\n" +
    "642"
  expect(results[key3]).toBe(-1);
});
