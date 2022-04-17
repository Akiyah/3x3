import { Quality } from '../../../src/js/modules/quality.js';

test('constructor', () => {
  const quality = new Quality();
  expect(quality.map).toEqual({});
});
