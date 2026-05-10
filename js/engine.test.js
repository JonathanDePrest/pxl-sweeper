import assert from 'node:assert';
import test from 'node:test';
import { indexToXY, XYToIndex } from './engine.js';

test('indexToXY mapping', () => {
  const width = 10;
  
  // (0,0)
  assert.deepStrictEqual(indexToXY(0, width), { x: 0, y: 0 });
  
  // (9,0) - end of first row
  assert.deepStrictEqual(indexToXY(9, width), { x: 9, y: 0 });
  
  // (0,1) - start of second row
  assert.deepStrictEqual(indexToXY(10, width), { x: 0, y: 1 });
  
  // (9,1) - end of second row
  assert.deepStrictEqual(indexToXY(19, width), { x: 9, y: 1 });
});

test('XYToIndex mapping', () => {
  const width = 10;
  
  // (0,0)
  assert.strictEqual(XYToIndex(0, 0, width), 0);
  
  // (9,0)
  assert.strictEqual(XYToIndex(9, 0, width), 9);
  
  // (0,1)
  assert.strictEqual(XYToIndex(0, 1, width), 10);
});

test('XYToIndex boundaries', () => {
  const width = 10;
  
  // Out of bounds: negative x
  assert.strictEqual(XYToIndex(-1, 0, width), -1);
  
  // Out of bounds: x >= width
  assert.strictEqual(XYToIndex(10, 0, width), -1);
  
  // Out of bounds: negative y
  assert.strictEqual(XYToIndex(0, -1, width), -1);
});
