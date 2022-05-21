import { ThreeSolver } from '../../../src/js/modules/three_solver.js';

describe('#init', () => {
  const solver = new ThreeSolver();
  const data = solver.init();

  test('size', () => {
    const keys = Object.keys(data);
    expect(keys.length).toBe(128170);
  });

  test('last', () => {
    const keys = Object.keys(data);
    const key = keys[keys.length - 1];
    expect(key).toBe(
      "   " + "\n" +
      "xox" + "\n" +
      "oxo" + "\n" +
      "000" + "\n" +
      "654" + "\n" +
      "321"
    );
    expect(data[key]).toBe(0);
  });

  test('o win', () => {
    const key =
      "x  " + "\n" +
      " x " + "\n" +
      "ooo" + "\n" +
      "500" + "\n" +
      "030" + "\n" +
      "642"
    expect(data[key]).toBe(1);
  });

  test('x win', () => {
    const key =
      "o  " + "\n" +
      " oo" + "\n" +
      "xxx" + "\n" +
      "500" + "\n" +
      "031" + "\n" +
      "642"
    expect(data[key]).toBe(-1);
  });
});

describe('#update', () => {
  const solver = new ThreeSolver();
  const data0 = solver.init();
  const data1 = solver.update(data0);

  test('next o win', () => {
    const key =
      "x  " + "\n" +
      " x " + "\n" +
      " oo" + "\n" +
      "600" + "\n" +
      "040" + "\n" +
      "053"
    expect(data1[key]).toBe(2);
  });

  test('next x win', () => {
    const key =
      "o  " + "\n" +
      " oo" + "\n" +
      " xx" + "\n" +
      "600" + "\n" +
      "042" + "\n" +
      "053"
    expect(data1[key]).toBe(-2);
  });
});
