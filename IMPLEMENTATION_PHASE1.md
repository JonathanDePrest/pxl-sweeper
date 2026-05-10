# IMPLEMENTATION_PHASE1.md: Project Foundation & Grid Engine

## 1. Architectural Design

### 1.1 Data Structure
The game board will be represented as a **1D Flat Array**. This simplifies serialization, storage, and certain algorithms (like mine distribution).

### 1.2 Coordinate Mapping
- **Index to XY**: `x = index % width`, `y = Math.floor(index / width)`
- **XY to Index**: `index = y * width + x`
- **Origin**: `(0, 0)` is the top-left corner of the grid.

### 1.3 State Constants
Initial difficulty settings (as per REQUIREMENTS.md):
- **Beginner**: 9x9, 10 mines
- **Intermediate**: 16x16, 40 mines
- **Expert**: 30x16, 99 mines

## 2. File-Level Strategy

| File | Responsibility |
| :--- | :--- |
| `package.json` | Project metadata, `"type": "module"`, and test scripts. |
| `index.html` | Root document with `#game-board` container. |
| `style.css` | Global styles, CSS Grid layout for the board. |
| `js/constants.js` | Source of truth for difficulty settings and state enums. |
| `js/engine.js` | Pure logic for coordinate mapping and math. |
| `js/engine.test.js` | Unit tests for `engine.js` using Node.js built-in test runner. |

## 3. Atomic Execution Steps

### 3.1 Initialize Project Environment
- **Plan**: Setup `package.json` to support ES Modules and testing.
- **Act**: Create `package.json` with `"type": "module"` and a `test` script using `node --test`.
- **Validate**: Run `npm test` (should report "no tests found" or exit gracefully).

### 3.2 Define Constants
- **Plan**: Create a central location for configuration.
- **Act**: Create `js/constants.js` exporting `DIFFICULTIES` and `TILE_STATES`.
- **Validate**: Verify file exists and exports match REQUIREMENTS.md.

### 3.3 Implement Mapping Logic
- **Plan**: Implement pure functions for 1D <-> 2D conversion.
- **Act**: Create `js/engine.js` with `indexToXY(index, width)` and `XYToIndex(x, y, width)`.
- **Validate**: Manual review of math logic.

### 3.4 Establish DOM & Style Foundation
- **Plan**: Prepare the visual container for the grid.
- **Act**: 
    - Create `index.html` with `<div id="game-board"></div>`.
    - Create `style.css` with a flexible `#game-board` using `display: grid`.
- **Validate**: Open `index.html` in a browser; verify the container exists and has expected styling (even if empty).

### 3.5 Verify Mapping with Unit Tests
- **Plan**: Ensure math functions handle boundaries correctly.
- **Act**: Create `js/engine.test.js` with test cases for (0,0), corner tiles, and out-of-bounds scenarios.
- **Validate**: Run `npm test` and ensure all tests pass.

## 4. Edge Case & Boundary Audit
- **Zero-Index**: Ensure `indexToXY(0)` returns `{x: 0, y: 0}`.
- **Max-Index**: Ensure `indexToXY(width * height - 1)` returns the bottom-right corner.
- **Out of Bounds**: How should `XYToIndex` handle `x >= width`? (Should return -1 or throw).
- **Grid Resizing**: CSS Grid must handle dynamic row/column counts via CSS Variables.

## 5. Verification Protocol
1. **Automated Tests**: `npm test` must pass 100%.
2. **Visual Check**:
    - Inspect `#game-board` in DevTools.
    - Confirm `display: grid` is active.
    - Confirm `grid-template-columns` can be adjusted via `--cols` variable.
3. **Console Check**:
    - Import `engine.js` in browser console and test `indexToXY` with different width values.

## 6. Code Scaffolding

### js/constants.js
```javascript
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
```

### js/engine.js
```javascript
export function indexToXY(index, width) {
  return {
    x: index % width,
    y: Math.floor(index / width)
  };
}

export function XYToIndex(x, y, width) {
  if (x < 0 || x >= width || y < 0) return -1;
  return y * width + x;
}
```
