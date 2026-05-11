# IMPLEMENTATION_PHASE3A.md: Instant Flood Fill

## 1. Architectural Design

### 1.1 Recursive Flood Fill logic
The flood fill algorithm will be triggered when an empty tile (neighbor count 0) is revealed.
- **Algorithm**: Depth-First Search (DFS) or Breadth-First Search (BFS). Given the relatively small board size (max 480 cells), simple recursion is acceptable, but we will use a stack-based iterative approach to be safe against call-stack limits.
- **Behavior**:
    - Reveal the starting tile.
    - If it's a "0" tile, add all 8 neighbors to the processing queue.
    - For each neighbor: if it's hidden and not a mine, reveal it.
    - If the neighbor is also a "0" tile, add its neighbors to the queue.
- **Output**: Returns a `Set` or `Array` of all indices that were revealed in this operation.

### 1.2 Win Condition logic
The game is won when the number of hidden tiles equals the total number of mines.
- `WinCondition = (TotalCells - RevealedCount) === MineCount`
- Alternatively: `WinCondition = (SafeCellsRevealed === TotalSafeCells)`

### 1.3 State Updates
- The `states` array is updated in-place during the flood fill.
- The function returns the list of indices that changed to `TILE_STATES.REVEALED`.

## 2. File-Level Strategy

| File | Responsibility |
| :--- | :--- |
| `js/engine.js` | Implement `floodFill(index, mines, counts, states, width, height)` and `checkWin(states, mineCount)`. |
| `js/engine.test.js` | Unit tests for flood fill (different shapes, edge of board) and win condition. |
| `js/ui.js` | Update `handleTileClick` to call `floodFill` and handle win state. |

## 3. Atomic Execution Steps

### 3.1 Implement Flood Fill
- **Plan**: Create the expansion logic.
- **Act**: Add `floodFill` to `js/engine.js`.
- **Validate**: Test on a mock grid with a known "island" of empty tiles.

### 3.2 Implement Win Condition
- **Plan**: Add logic to check if only mines are left.
- **Act**: Add `checkWin` to `js/engine.js`.
- **Validate**: Unit test: win state reached, win state not reached.

### 3.3 Update UI for Expansion
- **Plan**: Connect the new engine logic to the click handler.
- **Act**: Modify `js/ui.js` to call `floodFill` when a 0-tile is clicked.
- **Validate**: Manual check: clicking an empty area reveals the entire connected region.

### 3.4 Handle Win State UI
- **Plan**: Basic win feedback.
- **Act**: In `js/ui.js`, check `checkWin` after every reveal. Show an alert or console log.
- **Validate**: Clear a board (with debug help) and verify the win is detected.

## 4. Edge Case & Boundary Audit
- **Deep Recursion**: Stack-based iterative approach avoids overflow.
- **Board Edges**: `XYToIndex` and boundary checks in `floodFill` must prevent wrapping.
- **Already Revealed**: Ensure `floodFill` doesn't re-process revealed tiles (infinite loop).

## 5. Verification Protocol
1. **Engine Tests**: `npm test` covers `floodFill` accuracy and `checkWin`.
2. **Visual Verification**: 
    - Click an empty space; verify all adjacent spaces up to the number border are revealed.
    - Reveal all safe tiles; verify the game signals a win.
