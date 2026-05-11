# IMPLEMENTATION_PHASE4.md: Input & Chording System

## 1. Architectural Design

### 1.1 Flagging Logic
- **State**: `TILE_STATES.FLAGGED` (2).
- **Behavior**: Clicking a flagged tile (regardless of mode) unflags it. Clicking a hidden tile while "Flag Mode" is ON or via Right-Click flags it.
- **Constraints**: Flagged tiles cannot be revealed by normal clicks or flood fill.

### 1.2 Chording Logic
- **Trigger**: Click on a `REVEALED` tile where `counts[index] > 0`.
- **Condition Check**:
    1. Count adjacent `FLAGGED` tiles.
    2. If `flagCount > counts[index]`: Immediate **Game Over** (Requirement: Excessive flags).
    3. If `flagCount === counts[index]`:
        - Reveal all adjacent `HIDDEN` tiles.
        - If any revealed neighbor is a mine: **Game Over**.
        - If any revealed neighbor is an empty tile (`0`): Trigger `floodFill` for that neighbor.
    4. If `flagCount < counts[index]`: No action (Neutral).

### 1.3 Mobile "Flag Mode"
- **State**: A global boolean `isFlagModeActive`.
- **UI**: A toggle button that, when active, changes the game board border color (e.g., to a soft red or orange) to indicate high-stakes interaction.

## 2. File-Level Strategy

| File | Responsibility |
| :--- | :--- |
| `js/constants.js` | (Optional) Add `UI_COLORS` or specific state constants if needed. |
| `js/engine.js` | Implement `chordTile(index, mines, counts, states, width, height)`. |
| `js/engine.test.js` | Unit tests for chording (success, mine-hit, excessive flags). |
| `style.css` | Styles for `.tile.flagged` (mine icon or 'F'), flag mode toggle, and board border shift. |
| `js/ui.js` | Add event listeners for `contextmenu`, mobile toggle, and integrate chording into `handleTileClick`. |

## 3. Atomic Execution Steps

### 3.1 Right-Click Flagging
- **Plan**: Enable flagging via right-click on desktop.
- **Act**: 
    - Add `contextmenu` listener to tiles in `js/ui.js`.
    - Call `preventDefault()` to hide system menu.
    - Update `states[index]` to `FLAGGED` and call `updateUI`.
- **Validate**: Right-click a tile; verify it shows a flag/indicator and cannot be revealed by a left-click.

### 3.2 Mobile Flag Mode Toggle
- **Plan**: Add a UI button for touch users.
- **Act**:
    - Add `<button id="flag-toggle">Flag Mode: OFF</button>` to `index.html`.
    - Add listener in `js/ui.js` to toggle `isFlagModeActive`.
    - Apply a CSS class (e.g., `.flag-mode-active`) to `#game-board`.
- **Validate**: Click toggle; verify border color changes. Tap a tile; verify it flags instead of revealing.

### 3.3 Chording Engine Logic
- **Plan**: Implement the rules for clearing neighbors.
- **Act**: Implement `chordTile` in `js/engine.js`.
- **Validate**: Unit tests in `js/engine.test.js`.

### 3.4 Integrate Chording into UI
- **Plan**: Connect the engine's chord logic to the tile click handler.
- **Act**: 
    - In `handleTileClick`, if tile is `REVEALED`, call `chordTile`.
    - Use `animateReveal` for the resulting changes.
- **Validate**: Manual check: chord a number with correct flags clears neighbors; chord with wrong/too many flags ends game.

## 4. Edge Case & Boundary Audit
- **Excessive Flags**: Specifically check the requirement: if a user places 3 flags around a '2' and chords, they lose.
- **Flood Fill via Chord**: If a chord reveals an empty tile, the ripple should continue from that neighbor.
- **Flagged Mines**: Chording does not reveal flagged tiles, even if they are mines. The chord only evaluates the `HIDDEN` neighbors.
- **Multiple Explosions**: If a chord hits multiple mines (due to multiple misplaced flags), the ripple origin should be the clicked number, revealing all exploded mines.

## 5. Verification Protocol
1. **Engine Tests**: 
    - `chordTile` returns `gameOver: true` if `flags > count`.
    - `chordTile` returns `gameOver: true` if a hidden neighbor is a mine.
    - `chordTile` returns correct `changed` indices on success.
2. **Manual UX Checks**:
    - **Desktop**: Right-click flags correctly.
    - **Mobile**: Toggle works and visually shifts the board state.
    - **Chording**: Verify ripple animation starts from the number being chorded.

## 6. Code Scaffolding

### Chording Logic (engine.js)
```javascript
export function chordTile(index, mines, counts, states, width, height) {
  if (states[index] !== TILE_STATES.REVEALED || counts[index] === 0) {
    return { gameOver: false, changed: [] };
  }

  const { x, y } = indexToXY(index, width);
  const neighbors = [];
  let flagCount = 0;

  // 1. Gather neighbors and count flags
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = XYToIndex(nx, ny, width);
        neighbors.push(nIdx);
        if (states[nIdx] === TILE_STATES.FLAGGED) flagCount++;
      }
    }
  }

  // 2. Evaluate conditions
  if (flagCount > counts[index]) return { gameOver: true, changed: [] };
  if (flagCount < counts[index]) return { gameOver: false, changed: [] };

  // 3. Execution (flagCount === counts[index])
  let gameOver = false;
  let changed = [];

  for (const nIdx of neighbors) {
    if (states[nIdx] === TILE_STATES.HIDDEN) {
      if (mines[nIdx] === 1) {
        states[nIdx] = TILE_STATES.EXPLODED;
        gameOver = true;
        changed.push(nIdx);
      } else {
        states[nIdx] = TILE_STATES.REVEALED;
        changed.push(nIdx);
        if (counts[nIdx] === 0) {
          const expanded = floodFill(nIdx, mines, counts, states, width, height);
          changed.push(...expanded);
        }
      }
    }
  }

  return { gameOver, changed: Array.from(new Set(changed)) };
}
```
