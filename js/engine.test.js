import assert from 'node:assert';
import test from 'node:test';
import { indexToXY, XYToIndex, generateMines, calculateNeighbors, revealTile } from './engine.js';
import { TILE_STATES } from './constants.js';

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

test('generateMines count', () => {
  const count = 10;
  const totalCells = 81;
  const mines = generateMines(count, totalCells);
  
  let actualCount = 0;
  for (let i = 0; i < mines.length; i++) {
    if (mines[i] === 1) actualCount++;
  }
  
  assert.strictEqual(actualCount, count);
  assert.strictEqual(mines.length, totalCells);
});

test('calculateNeighbors logic', () => {
  const width = 3;
  const height = 3;
  const mines = new Uint8Array([
    1, 0, 0,
    0, 0, 0,
    0, 0, 1
  ]);
  
  const counts = calculateNeighbors(mines, width, height);
  const expected = new Int8Array([
    0, 1, 0,
    1, 2, 1,
    0, 1, 0
  ]);
  
  // Note: we don't care about counts for cells that ARE mines in this test, 
  // though the implementation skips them.
  assert.deepStrictEqual(counts, expected);
});

test('revealTile basic logic', () => {
  const mines = new Uint8Array([0, 1]);
  const states = new Uint8Array([TILE_STATES.HIDDEN, TILE_STATES.HIDDEN]);
  
  // Reveal safe tile
  const result1 = revealTile(0, mines, states);
  assert.strictEqual(result1.gameOver, false);
  assert.deepStrictEqual(result1.changed, [0]);
  assert.strictEqual(states[0], TILE_STATES.REVEALED);
  
  // Reveal mine tile
  const result2 = revealTile(1, mines, states);
  assert.strictEqual(result2.gameOver, true);
  assert.deepStrictEqual(result2.changed, [1]);
  assert.strictEqual(states[1], TILE_STATES.EXPLODED);
});
