import assert from 'node:assert';
import test from 'node:test';
import { Timer } from '../../js/timer.js';

test('Timer: starts and ticks', (t, done) => {
  let tickCount = 0;
  const timer = new Timer((elapsed) => {
    tickCount++;
    if (tickCount === 2) {
      timer.stop();
      assert.strictEqual(elapsed, 2);
      done();
    }
  });

  // Since we are in a real node environment, we can't easily mock Date.now() 
  // without a library, but we can verify the tick happens.
  timer.start();
});

test('Timer: reset stops and clears elapsed', () => {
  const timer = new Timer();
  timer.elapsed = 10;
  timer.reset();
  assert.strictEqual(timer.getTime(), 0);
  assert.strictEqual(timer.interval, null);
});
