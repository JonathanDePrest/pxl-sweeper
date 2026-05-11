import assert from 'node:assert';
import test from 'node:test';
import { mock } from 'node:test';

// Simple mock for localStorage
const storageMock = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, value) { this.data[key] = String(value); },
  clear() { this.data = {}; }
};
global.localStorage = storageMock;

import { getStats, saveGame } from '../../js/storage.js';

test('Storage: initial load returns defaults', () => {
  localStorage.clear();
  const stats = getStats();
  assert.ok(stats.stats.BEGINNER);
  assert.strictEqual(stats.stats.BEGINNER.attempts, 0);
});

test('Storage: saving game updates attempts and wins', () => {
  localStorage.clear();
  saveGame('BEGINNER', 10, true);
  
  const stats = getStats();
  assert.strictEqual(stats.stats.BEGINNER.attempts, 1);
  assert.strictEqual(stats.stats.BEGINNER.wins, 1);
  assert.strictEqual(stats.stats.BEGINNER.bestTime, 10);
});

test('Storage: best time only updates if lower', () => {
  localStorage.clear();
  saveGame('BEGINNER', 20, true);
  saveGame('BEGINNER', 15, true);
  saveGame('BEGINNER', 30, true);
  
  const stats = getStats();
  assert.strictEqual(stats.stats.BEGINNER.bestTime, 15);
});
