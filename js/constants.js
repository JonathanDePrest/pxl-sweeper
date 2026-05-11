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
