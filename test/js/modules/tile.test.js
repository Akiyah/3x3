const Tile = require('../../../src/js/modules/tile');

describe('constructor', () => {
  test('no status', () => {
    const tile = new Tile(1, 2, 5);

    expect(tile.x).toBe(1);
    expect(tile.y).toBe(2);
    expect(tile.n).toBe(5);
    expect(tile.status).toBe(null);
  });

  test('with status', () => {
    const tile = new Tile(1, 2, 5, 'new');

    expect(tile.x).toBe(1);
    expect(tile.y).toBe(2);
    expect(tile.n).toBe(5);
    expect(tile.status).toBe('new');
  });
});

test('#toString', () => {
  expect(new Tile(1, 2, 5).toString()).toBe("1,2,5");
  expect(new Tile(1, 2, 5, 'new').toString()).toBe("1,2,5,new");
});

describe('#rotate', () => {
  test('no argument', () => {
    expect(new Tile(0, 0,  0).rotate().toString()).toBe("0,3,0");
    expect(new Tile(0, 1,  1).rotate().toString()).toBe("1,3,1");
    expect(new Tile(0, 2,  2).rotate().toString()).toBe("2,3,2");
    expect(new Tile(0, 3,  3).rotate().toString()).toBe("3,3,3");

    expect(new Tile(1, 0,  4).rotate().toString()).toBe("0,2,4");
    expect(new Tile(1, 1,  5).rotate().toString()).toBe("1,2,5");
    expect(new Tile(1, 2,  6).rotate().toString()).toBe("2,2,6");
    expect(new Tile(1, 3,  7).rotate().toString()).toBe("3,2,7");

    expect(new Tile(2, 0,  8).rotate().toString()).toBe("0,1,8");
    expect(new Tile(2, 1,  9).rotate().toString()).toBe("1,1,9");
    expect(new Tile(2, 2, 10).rotate().toString()).toBe("2,1,10");
    expect(new Tile(2, 3, 11).rotate().toString()).toBe("3,1,11");

    expect(new Tile(3, 0, 12).rotate().toString()).toBe("0,0,12");
    expect(new Tile(3, 1, 13).rotate().toString()).toBe("1,0,13");
    expect(new Tile(3, 2, 14).rotate().toString()).toBe("2,0,14");
    expect(new Tile(3, 3, 15).rotate().toString()).toBe("3,0,15");
  });

  test('with argument', () => {
    expect(new Tile(0, 0,  0).rotate(0).toString()).toBe("0,0,0");
    expect(new Tile(0, 0,  0).rotate(1).toString()).toBe("0,3,0");
    expect(new Tile(0, 0,  0).rotate(2).toString()).toBe("3,3,0");
    expect(new Tile(0, 0,  0).rotate(3).toString()).toBe("3,0,0");

    expect(new Tile(0, 0,  0).rotate(-1).toString()).toBe("3,0,0");
    expect(new Tile(0, 0,  0).rotate(-2).toString()).toBe("3,3,0");
    expect(new Tile(0, 0,  0).rotate(-3).toString()).toBe("0,3,0");
  });

  test('with status', () => {
    expect(new Tile(0, 0, 0, 'new').rotate().toString()).toBe("0,3,0,new");
    expect(new Tile(0, 0, 0, 'new').rotate(2).toString()).toBe("3,3,0,new");
  });
});
