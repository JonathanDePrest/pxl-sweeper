export const DIFFICULTIES = {
  BEGINNER: { rows: 9, cols: 9, mines: 10 },
  INTERMEDIATE: { rows: 16, cols: 16, mines: 40 },
  EXPERT: { rows: 16, cols: 30, mines: 99 }
};

export const TILE_STATES = {
  HIDDEN: 0,
  REVEALED: 1,
  FLAGGED: 2,
  EXPLODED: 3
};

export const WAVE_DELAY = 60;
export const ANIMATION_WAVE_CAP = 15;

export const NUMBER_COLORS = {
  1: '#0984e3', // blue
  2: '#27ae60', // green
  3: '#d63031', // red
  4: '#6c5ce7', // purple
  5: '#a29bfe', // light purple
  6: '#00cec9', // cyan
  7: '#fdcb6e', // yellow
  8: '#2d3436'  // dark grey
};
