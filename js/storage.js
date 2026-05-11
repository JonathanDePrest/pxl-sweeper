const STORAGE_KEY = 'pxl_sweeper_stats';

const DEFAULT_DATA = {
  stats: {
    BEGINNER: { bestTime: null, attempts: 0, wins: 0 },
    INTERMEDIATE: { bestTime: null, attempts: 0, wins: 0 },
    EXPERT: { bestTime: null, attempts: 0, wins: 0 }
  },
  settings: {
    highContrast: false
  }
};

export function getStats() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    // Deep clone defaults to avoid mutation pollution
    const defaults = JSON.parse(JSON.stringify(DEFAULT_DATA));
    
    if (!data) return defaults;
    
    const parsed = JSON.parse(data);
    return {
      stats: { ...defaults.stats, ...parsed.stats },
      settings: { ...defaults.settings, ...parsed.settings }
    };
  } catch (e) {
    console.error('Failed to load stats:', e);
    return DEFAULT_DATA;
  }
}

export function saveGame(difficultyKey, time, isWin) {
  const current = getStats();
  const diffStats = current.stats[difficultyKey] || { bestTime: null, attempts: 0, wins: 0 };
  
  diffStats.attempts++;
  if (isWin) {
    diffStats.wins++;
    if (time !== null) {
      if (diffStats.bestTime === null || time < diffStats.bestTime) {
        diffStats.bestTime = time;
      }
    }
  }
  
  current.stats[difficultyKey] = diffStats;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function updateSettings(settings) {
  const current = getStats();
  current.settings = { ...current.settings, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
