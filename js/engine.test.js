import assert from 'node:assert';
import test from 'node:test';
import { indexToXY, XYToIndex, generateMines, calculateNeighbors, revealTile, floodFill, checkWin, getChebyshevDistance } from './engine.js';
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

test('floodFill expansion', () => {
  const width = 3;
  const height = 3;
  // Grid:
  // 1 1 1
  // 1 M 1
  // 1 1 1
  // If we click (0,0), it's a "1", so no expansion.
  const mines = new Uint8Array([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  const counts = calculateNeighbors(mines, width, height);
  const states = new Uint8Array(9).fill(TILE_STATES.HIDDEN);
  
  const changed1 = floodFill(0, mines, counts, states, width, height);
  assert.strictEqual(changed1.length, 1);
  assert.strictEqual(states[0], TILE_STATES.REVEALED);
  
  // Mock a situation where (0,0) is "0"
  const mines2 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const counts2 = new Int8Array(9).fill(0);
  const states2 = new Uint8Array(9).fill(TILE_STATES.HIDDEN);
  
  const changed2 = floodFill(0, mines2, counts2, states2, width, height);
  assert.strictEqual(changed2.length, 9); // All revealed
  for (let i = 0; i < 9; i++) {
    assert.strictEqual(states2[i], TILE_STATES.REVEALED);
  }
});

test('floodFill handles already revealed start tile', () => {
  const width = 3;
  const height = 3;
  const mines = new Uint8Array(9).fill(0);
  const counts = new Int8Array(9).fill(0);
  const states = new Uint8Array(9).fill(TILE_STATES.HIDDEN);
  
  // Simulate revealTile(0)
  states[0] = TILE_STATES.REVEALED;
  
  // Call floodFill on already revealed tile
  const changed = floodFill(0, mines, counts, states, width, height);
  
  // It should still expand to neighbors
  // Even if it doesn't include 0 in 'changed' (since it was already changed),
  // it MUST change the neighbors.
  assert.ok(changed.length > 0, 'Should reveal neighbors');
  assert.strictEqual(states[1], TILE_STATES.REVEALED);
});

test('checkWin logic', () => {
  const mineCount = 1;
  const states = new Uint8Array([TILE_STATES.REVEALED, TILE_STATES.HIDDEN]);
  
  // One tile revealed, one hidden (the mine)
  assert.strictEqual(checkWin(states, mineCount), true);
  
  // Both hidden
  const states2 = new Uint8Array([TILE_STATES.HIDDEN, TILE_STATES.HIDDEN]);
  assert.strictEqual(checkWin(states2, mineCount), false);
});

test('getChebyshevDistance logic', () => {
  const width = 9;
  
  // Same index
  assert.strictEqual(getChebyshevDistance(0, 0, width), 0);
  
  // Adjacent orthogonal
  assert.strictEqual(getChebyshevDistance(0, 1, width), 1);
  assert.strictEqual(getChebyshevDistance(0, 9, width), 1);
  
  // Adjacent diagonal
  assert.strictEqual(getChebyshevDistance(0, 10, width), 1);
  
  // Distance 2
  assert.strictEqual(getChebyshevDistance(0, 2, width), 2);
  assert.strictEqual(getChebyshevDistance(0, 18, width), 2);
  assert.strictEqual(getChebyshevDistance(0, 20, width), 2);
});
