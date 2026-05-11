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
