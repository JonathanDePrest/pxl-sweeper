# TODO: PXL Sweeper

## Phase 1: Project Foundation & Grid Engine
- [x] Initialize `package.json` with test scripts.
- [x] Create `js/constants.js` with grid dimensions for Beginner, Intermediate, Expert.
- [x] Implement `indexToXY` and `XYToIndex` in `js/engine.js`.
- [x] Define main `#game-board` CSS Grid structure in `index.html` and `style.css`.
- [x] Add unit tests for mapping logic in `js/engine.test.js`.

## Phase 2: Hardcore Gameplay Core
- [x] Implement `generateMines(difficulty)` with random distribution.
- [x] Implement `calculateNeighbors()` for all tiles.
- [x] Create basic `revealTile(index)` logic that triggers Game Over on mine.
- [x] Build `js/ui.js` to dynamically inject tiles into the CSS Grid.
- [x] Verify "Hardcore Start" by ensuring mines are placed BEFORE the first interaction.

## Phase 3A: Instant Flood Fill
- [x] Implement iterative `floodFill(index)` in `js/engine.js`.
- [x] Implement `checkWin()` logic.
- [x] Add unit tests for expansion and win detection.

## Phase 3B: Ripple Orchestration
- [x] Implement `getChebyshevDistance(origin, target)` helper.
- [x] Create `animateRevealQueue()` to stagger tile pops based on distance.
- [x] Add CSS transitions/animations for the "pop" effect.
- [x] Implement the 15-wave animation cap (stagger ends, remaining reveal instantly).
- [x] Verify `will-change` is applied only during active animation cycles.

## Phase 4: Input & Chording System
- [x] Add Right-click event listener for flagging.
- [x] Implement "Flag Mode" toggle and border color shift.
- [x] Implement chording logic in `js/engine.js`.
- [x] Add specific test case: Chording with excessive flags = Game Over.
- [x] Add specific test case: Chording with correct flags = Reveal neighbors.

## Phase 5: Persistence & UI Refinement
- [x] Implement `js/storage.js` for JSON-based stat persistence.
- [x] Add Difficulty selection menu to UI.
- [x] Finalize Inter font and typography.
- [x] Implement quick restart (Space/R keys) and long-press reset.
- [x] Stub `highContrast: false` in the initial storage schema.

## Phase 6: Stabilization & Final Review
- [x] Perform final sweep of all game modes.
- [x] Verify AC 1-5 fulfillment.
- [x] Update `README.md` with final instructions.
