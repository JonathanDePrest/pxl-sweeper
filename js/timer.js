export class Timer {
  constructor(onTick) {
    this.onTick = onTick;
    this.interval = null;
    this.startTime = 0;
    this.elapsed = 0;
  }

  start() {
    if (this.interval) return;
    this.startTime = Date.now() - (this.elapsed * 1000);
    this.interval = setInterval(() => {
      this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.elapsed > 999) this.elapsed = 999;
      if (this.onTick) this.onTick(this.elapsed);
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  reset() {
    this.stop();
    this.elapsed = 0;
    if (this.onTick) this.onTick(0);
  }

  getTime() {
    return this.elapsed;
  }
}
