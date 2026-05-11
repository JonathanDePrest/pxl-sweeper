# IMPLEMENTATION_PHASE2.md: Hardcore Gameplay Core

## 1. Architectural Design

### 1.1 Mine Distribution logic
Mines will be placed using a Fisher-Yates shuffle or a similar random selection algorithm on the 1D array indices. This ensures exactly $N$ mines are placed.

### 1.2 Neighbor Calculation
For each tile, we calculate the 8 surrounding neighbors (including diagonals).
- Use `indexToXY` to get coordinates.
- Iterate from `x-1` to `x+1` and `y-1` to `y+1`.
- Convert back to index using `XYToIndex` (handling boundaries).
- Store neighbor counts in a separate 1D array or as part of a tile state object. *Decision: Use a 1D `Int8Array` for mine counts to keep memory usage low and performance high.*

### 1.3 State Representation
- `mines`: `Uint8Array` (0 for safe, 1 for mine).
- `counts`: `Int8Array` (number of adjacent mines).
- `states`: `Uint8Array` (from `TILE_STATES` in `constants.js`).

## 2. File-Level Strategy

| File | Responsibility |
| :--- | :--- |
| `js/engine.js` | Add `generateMines`, `calculateNeighbors`, and `revealTile` (pure logic). |
| `js/engine.test.js` | Unit tests for mine counts and distribution. |
| `js/ui.js` | New file. Handles DOM creation, event listeners, and mapping engine state to the grid. |

## 3. Atomic Execution Steps

### 3.1 Implement Mine Generation
- **Plan**: Create a function to randomly place mines.
- **Act**: Add `generateMines(count, totalCells)` to `js/engine.js`.
- **Validate**: Test that it returns exactly `count` mines and they are within bounds.

### 3.2 Implement Neighbor Calculation
- **Plan**: Calculate adjacent mine counts for all cells.
- **Act**: Add `calculateNeighbors(mines, width, height)` to `js/engine.js`.
- **Validate**: Unit test with a known mine pattern (e.g., a 3x3 grid with 1 mine in the center).

### 3.3 Create Basic Reveal Logic
- **Plan**: Logic to change tile state and check for mines.
- **Act**: Add `revealTile(index, gameState)` to `js/engine.js`.
- **Validate**: Test that revealing a mine returns a "Game Over" state.

### 3.4 Build UI Layer (Initial)
- **Plan**: Dynamically generate the grid in the DOM.
- **Act**: 
    - Create `js/ui.js`.
    - Implement `renderGrid(width, height)` to create div elements.
    - Attach a click listener that calls `revealTile`.
- **Validate**: Open `index.html` and verify tiles appear and respond to clicks (console log).

### 3.5 Verify "Hardcore Start"
- **Plan**: Ensure mines are there from the beginning.
- **Act**: Initialize game state (mines + neighbors) on page load.
- **Validate**: Use a debug mode or console log to verify mines are set before the first click.

## 4. Edge Case & Boundary Audit
- **Grid Corners**: Neighbors should not wrap around rows.
- **Max Mines**: What if `mines == totalCells`? (Handled by shuffle).
- **First Click Death**: Explicitly test that clicking index `i` when `mines[i] == 1` results in immediate failure.

## 5. Verification Protocol
1. **Engine Tests**: `npm test` covers `generateMines` and `calculateNeighbors`.
2. **Visual Verification**: 
    - Inspect DOM to see tiles are correctly injected.
    - Click a tile; verify it changes class/content based on its engine state.
