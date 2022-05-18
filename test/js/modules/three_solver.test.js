import { ThreeSolver } from '../../../src/js/modules/three_solver.js';

describe('#init', () => {
  const solver = new ThreeSolver();
  const results = solver.init();

  test('size', () => {
    const keys = Object.keys(results);
    expect(keys.length).toBe(128170);
  });

  test('last', () => {
    const keys = Object.keys(results);
    const key = keys[keys.length - 1];
    expect(key).toBe(
      "   " + "\n" +
      "xox" + "\n" +
      "oxo" + "\n" +
      "000" + "\n" +
      "654" + "\n" +
      "321"
    );
    expect(results[key]).toBe(0);
  });

  test('o win', () => {
    const key =
      "x  " + "\n" +
      " x " + "\n" +
      "ooo" + "\n" +
      "500" + "\n" +
      "030" + "\n" +
      "642"
    expect(results[key]).toBe(1);
  });

  test('x win', () => {
    const key =
      "o  " + "\n" +
      " oo" + "\n" +
      "xxx" + "\n" +
      "500" + "\n" +
      "031" + "\n" +
      "642"
    expect(results[key]).toBe(-1);
  });
});
