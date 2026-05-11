# IMPLEMENTATION_PHASE5.md: Persistence & UI Refinement

## 1. Architectural Design

### 1.1 Persistence Layer (`js/storage.js`)
- **Schema**:
  ```json
  {
    "stats": {
      "BEGINNER": { "bestTime": null, "attempts": 0, "wins": 0 },
      "INTERMEDIATE": { "bestTime": null, "attempts": 0, "wins": 0 },
      "EXPERT": { "bestTime": null, "attempts": 0, "wins": 0 }
    },
    "settings": {
      "highContrast": false
    }
  }
  ```
- **Functions**:
    - `saveStats(difficulty, time, isWin)`
    - `getStats()`
    - `updateSettings(settings)`

### 1.2 Difficulty Selection
- A menu at the top of the screen to switch between Beginner, Intermediate, and Expert.
- Switching difficulty triggers `initGame()` and re-renders the grid.

### 1.3 Quick Restart & Timers
- **Timers**: track elapsed seconds from first click until win/loss.
- **Controls**:
    - `Space` or `R` keys to immediately call `initGame()`.
    - Long-press on a UI "Reset" button (for mobile).

### 1.4 Typography & Aesthetics
- Switch to **Inter** font (system-ui fallback).
- Minimalist "flat" styling (no beveled edges).
- High-contrast color palette for number hints.

## 2. File-Level Strategy

| File | Responsibility |
| :--- | :--- |
| `js/storage.js` | New file. Handles all `localStorage` interactions and JSON schema validation. |
| `index.html` | Add difficulty menu, timer display, and stats overlay. |
| `style.css` | Import Inter font, add minimalist styling, and timer/menu layouts. |
| `js/ui.js` | Integrate timer logic, difficulty switching, and keyboard listeners. |
| `js/constants.js` | Add color mappings for numbers (1-8). |

## 3. Atomic Execution Steps

### 3.1 LocalStorage Integration
- **Plan**: Create the persistence module.
- **Act**: 
    - Implement `js/storage.js` with `load` and `save` methods.
    - Initialize default stats if none exist.
- **Validate**: Manually run `saveStats` in console and verify `localStorage` contains the JSON string.

### 3.2 Difficulty Menu
- **Plan**: Add interactive menu to switch board sizes.
- **Act**:
    - Add `<select>` or button group to `index.html`.
    - Update `js/ui.js` to handle difficulty change events.
- **Validate**: Switch to "Expert"; verify grid expands to 30x16.

### 3.3 Timer & Stats Logic
- **Plan**: Implement game timing and win-state recording.
- **Act**:
    - Start timer on first reveal. Stop on win/loss.
    - Update `handleTileClick` to call `saveStats` on win.
- **Validate**: Win a game (Beginner); verify "Best Time" updates in storage.

### 3.4 Keyboard & Mobile Reset
- **Plan**: Add UX shortcuts for fast play.
- **Act**:
    - Add `keydown` listener for 'R' and 'Space'.
    - Implement a simple "Reset" button with `mousedown/mouseup` timer for long-press.
- **Validate**: Press 'R' during a game; verify board resets immediately.

### 3.5 Aesthetic Polish
- **Plan**: Final CSS refinements.
- **Act**:
    - Apply Inter font.
    - Define high-contrast colors for numbers 1-8.
    - Remove any remaining default browser styles (buttons, select).
- **Validate**: Visual check against "Modern Minimalism" requirement.

## 4. Edge Case & Boundary Audit
- **First-Click Timer**: Ensure the timer doesn't start until the player actually interacts (reveals a tile), even though mines are pre-generated.
- **Storage Corruption**: Use `try/catch` around `JSON.parse` for local storage to prevent app crashes if the user manually edits it.
- **Difficulty Shift mid-game**: Switching difficulty during an active game should reset the state without prompt (Hardcore mindset).

## 5. Verification Protocol
1. **Persistence Check**: Refresh page; verify difficulty and stats persist.
2. **Timer Accuracy**: Verify timer stops precisely when the last safe tile is revealed (before or during the last ripple).
3. **UX Shortcuts**: Verify 'R' works even if the board is animating.

## 6. Code Scaffolding

### Storage Module (js/storage.js)
```javascript
const STORAGE_KEY = 'pxl_sweeper_stats';

export function getStats() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { stats: {}, settings: { highContrast: false } };
}

export function saveGame(difficultyKey, time, isWin) {
  const current = getStats();
  const diffStats = current.stats[difficultyKey] || { bestTime: Infinity, attempts: 0, wins: 0 };
  
  diffStats.attempts++;
  if (isWin) {
    diffStats.wins++;
    if (time < diffStats.bestTime) diffStats.bestTime = time;
  }
  
  current.stats[difficultyKey] = diffStats;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
```
