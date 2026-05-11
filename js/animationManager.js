import { WAVE_DELAY, ANIMATION_WAVE_CAP } from './constants.js';
import { getChebyshevDistance } from './engine.js';

export class AnimationManager {
  constructor(updateCallback) {
    this.updateCallback = updateCallback;
  }

  animateReveal(indices, originIndex, width) {
    const groups = new Map();

    indices.forEach(idx => {
      const d = getChebyshevDistance(originIndex, idx, width);
      const wave = Math.min(d, ANIMATION_WAVE_CAP);
      if (!groups.has(wave)) groups.set(wave, []);
      groups.get(wave).push(idx);
    });

    groups.forEach((groupIndices, wave) => {
      setTimeout(() => {
        this.updateCallback(groupIndices);
      }, wave * WAVE_DELAY);
    });
  }
}
