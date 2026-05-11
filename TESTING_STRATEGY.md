# TESTING_STRATEGY.md: PXL Sweeper Quality Assurance

## 1. Infrastructure Check

### 1.1 Detected Tools
- **Runner**: Node.js Native Test Runner (`node --test`).
- **Assertions**: `node:assert/strict`.
- **Mocking**: `node:test` built-in `mock` utility.
- **Environment**: Node.js (ES Modules).

### 1.2 Directory Structure
Following industry standards for modern JavaScript projects:
- **Unit Tests**: `js/*.test.js` - Co-located with source for rapid iteration and logic isolation.
- **Integration Tests**: `tests/integration/` - Dedicated root-level folder for cross-module validation and data-flow verification.

---

## 2. Test Map

### 2.1 Unit Tests (`js/engine.test.js`)
| Scenario | Category | Boundary/Edge Case |
| :--- | :--- | :--- |
| **Coordinate Mapping** | Happy Path | Orthogonal and diagonal index conversion. |
| **Coordinate Mapping** | Edge Case | Out-of-bounds `XYToIndex` returns -1. |
| **Mine Generation** | Happy Path | Correct count and distribution using Fisher-Yates. |
| **Neighbor Counting** | Boundary | Cells at board corners and edges (8-way check). |
| **Flood Fill** | Edge Case | Deep recursion on Expert (30x16) empty boards. |
| **Flood Fill** | Edge Case | Already revealed or flagged tiles are not re-processed. |
| **Chording** | Happy Path | Successful clear when flags match number. |
| **Chording** | Hardcore | **Excessive flags** must trigger `gameOver: true`. |
| **Chording** | Hardcore | Hitting a mine via chord triggers `gameOver: true`. |
| **Win Condition** | Boundary | Exactly `total - mines` revealed tiles triggers win. |

### 2.2 Integration Tests (`tests/integration/`)
| Scenario | Component interaction | Side Effect Check |
| :--- | :--- | :--- |
| **Persistence Flow** | `UI` -> `Storage` | High score saves to `localStorage` on win. |
| **Timer Flow** | `Events` -> `UI` | Timer starts on first click, stops on explosion/win. |
| **Animation Ripple** | `Engine` -> `UI` | Chebyshev distances map correctly to `setTimeout` waves. |
| **Difficulty Switch** | `UI` -> `Engine` | Changing select menu re-initializes 1D arrays and DOM. |

---

## 3. Implementation Pattern (AAA)

All tests must follow the **Arrange, Act, Assert** pattern:
1. **Arrange**: Set up the grid state, mine positions, and flags.
2. **Act**: Execute the engine function (e.g., `revealTile` or `chordTile`).
3. **Assert**: Verify the returned `changed` indices and the `gameOver` status.

---

## 4. Code Samples

### 4.1 Unit Test Template (AAA Pattern)
```javascript
test('chordTile logic: excessive flags results in death', () => {
  // 1. Arrange
  const width = 3;
  const mines = new Uint8Array(9).fill(0);
  const counts = calculateNeighbors(mines, width, 3);
  const states = new Uint8Array(9).fill(TILE_STATES.HIDDEN);
  
  states[0] = TILE_STATES.REVEALED; // (0,0) is '0' technically, but we mock counts
  states[1] = TILE_STATES.FLAGGED;
  states[3] = TILE_STATES.FLAGGED; // 2 flags for a tile that should only have 1 (mocked)

  // 2. Act
  const result = chordTile(0, mines, counts, states, width, 3);

  // 3. Assert
  assert.strictEqual(result.gameOver, true, 'Should trigger Game Over due to excessive flags');
});
```

### 4.2 Integration Test Helper (Mocking Storage)
```javascript
import { mock } from 'node:test';

test('Game Win saves stats to storage', () => {
  const mockSave = mock.fn();
  // Mocking the storage module dependency
  const storage = { saveGame: mockSave };
  
  // Trigger win logic...
  handleWin(); 
  
  assert.strictEqual(mockSave.mock.callCount(), 1);
});
```

---

## 5. Execution Guide

To execute the full suite (Unit + Integration):
```bash
npm test
```

To run a specific test file:
```bash
node --test js/engine.test.js
```

To run tests with watch mode (during development):
```bash
node --test --watch js/engine.test.js
```
