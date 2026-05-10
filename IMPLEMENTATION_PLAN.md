# Implementation Plan - PXL Sweeper

## Overview
PXL Sweeper is a modern, minimalist Minesweeper clone with "Hardcore" mechanics (first-click death) and high-fidelity "Liquid" animations. This plan outlines a sequential path from core grid logic to a polished, responsive web application.

## Assumptions
- The project is a static site (HTML/CSS/JS).
- Modern browser support (ES Modules, CSS Grid, LocalStorage) is sufficient.
- "Hardcore" start means no special handling for the first click; it is generated before user interaction.
- The 15-wave animation cap is necessary for performance on Expert (30x16) boards.

## Delivery strategy
This plan uses a **hybrid** approach:
- **Vertical Slices** for core gameplay (Logic -> UI -> Animation) to ensure high-risk mechanics are validated early.
- **Layered Implementation** for secondary features like Persistence and Difficulty presets.
- **Risk Isolation**: Decouples recursive logic from animation orchestration to prevent "Phase Bloat".

## Phase list
- **Phase 1: Project Foundation & Grid Engine**: Establish 1D array mapping, DOM structure, and basic board state.
- **Phase 2: Hardcore Gameplay Core**: Implement mine generation and immediate reveal/death logic.
- **Phase 3A: Instant Flood Fill**: Build the logical recursive expansion and win condition validation.
- **Phase 3B: Ripple Orchestration**: Apply the staggered Chebyshev distance-based animation layer.
- **Phase 4: Input & Chording System**: Implement Desktop/Mobile controls and robust chording validation.
- **Phase 5: Persistence & UI Refinement**: Add LocalStorage stats, High Contrast stubs, and final aesthetics.
- **Phase 6: Stabilization & Final Review**: Bug fixing and requirement verification.

## Detailed phases

### Phase 1: Project Foundation & Grid Engine
**Goal**: Establish the foundational data structures, coordinate mapping, and core DOM structure.
**Scope**: Boilerplate setup, 1D array initialization, mapping functions, and CSS Grid container definition.
**Expected files to change**:
- `package.json`
- `index.html`
- `style.css`
- `js/constants.js`
- `js/engine.js`
- `js/engine.test.js`
**Dependencies**: None.
**Risks**: Low.
**Tests and checks to run**:
- `npm test` (Unit tests for index-to-coordinate mapping).
- `npm run lint`
**Review check before moving work to `DONE.md`**:
- Confirm 1D array approach is used.
- Verify CSS Grid container is defined in `index.html` to avoid later layout rework.
**Exact `TODO.md` entries to refresh from this phase**:
- [ ] Initialize `package.json` with test scripts.
- [ ] Create `js/constants.js` with grid dimensions for Beginner, Intermediate, Expert.
- [ ] Implement `indexToXY` and `XYToIndex` in `js/engine.js`.
- [ ] Define main `#game-board` CSS Grid structure in `index.html` and `style.css`.
- [ ] Add unit tests for mapping logic in `js/engine.test.js`.
**Exit criteria for moving items to `DONE.md`**:
- `js/engine.js` contains verified mapping functions.
- `index.html` has a static grid container ready for dynamic tile insertion.

### Phase 2: Hardcore Gameplay Core
**Goal**: Implement randomized mine placement and immediate interaction logic.
**Scope**: Mine distribution, neighbor counting, and basic "Hardcore" reveal (first click can die).
**Expected files to change**:
- `js/engine.js`
- `js/engine.test.js`
- `js/ui.js`
**Dependencies**: Phase 1.
**Risks**: Medium. Ensuring mine distribution is truly random.
**Tests and checks to run**:
- `npm test` (Validate mine counts and neighbor calculation).
- Manual smoke test: Click a tile and verify it reveals its state correctly.
**Review check before moving work to `DONE.md`**:
- Confirm first-click death is possible (no safety net).
**Exact `TODO.md` entries to refresh from this phase**:
- [ ] Implement `generateMines(difficulty)` with random distribution.
- [ ] Implement `calculateNeighbors()` for all tiles.
- [ ] Create basic `revealTile(index)` logic that triggers Game Over on mine.
- [ ] Build `js/ui.js` to dynamically inject tiles into the CSS Grid.
- [ ] Verify "Hardcore Start" by ensuring mines are placed BEFORE the first interaction.
**Exit criteria for moving items to `DONE.md`**:
- Grid can be generated and rendered.
- Clicking a mine ends the game immediately.

### Phase 3A: Instant Flood Fill
**Goal**: Implement the logical recursive expansion and win condition.
**Scope**: Recursive reveal for empty tiles (instant reveal without animation) and game state management (Win/Loss).
**Expected files to change**:
- `js/engine.js`
- `js/engine.test.js`
**Dependencies**: Phase 2.
**Risks**: Medium. Potential call-stack overflow from deep recursion on Expert boards.
**Tests and checks to run**:
- `npm test` (Verify recursive expansion reveals the correct number of tiles).
- Unit test: "Winning the game" when all non-mine tiles are revealed.
**Review check before moving work to `DONE.md`**:
- Confirm recursion logic is decoupled from any UI timing/delays.
**Exact `TODO.md` entries to refresh from this phase**:
- [ ] Implement recursive `floodFill(index)` in `js/engine.js`.
- [ ] Implement `checkWinCondition()` logic.
- [ ] Add unit tests for large area clears on an Expert-sized mock grid.
**Exit criteria for moving items to `DONE.md`**:
- Logic correctly identifies all safe tiles connected to an empty space.
- Win condition is triggered when exactly `TotalTiles - MineCount` are revealed.

### Phase 3B: Ripple Orchestration
**Goal**: Apply the "Liquid" staggered animation layer to the reveal logic.
**Scope**: Chebyshev distance-based animation queue and the 15-wave animation cap.
**Expected files to change**:
- `js/ui.js`
- `style.css`
**Dependencies**: Phase 3A.
**Risks**: High. Performance on Expert boards.
**Tests and checks to run**:
- Manual UX check: Verify "Liquid" ripple starts from click source.
- Performance check: Reveal large area and ensure 60fps.
- Mock Test: Tiles at distance > 15 must have 0ms animation delay.
**Review check before moving work to `DONE.md`**:
- Verify `will-change: transform` is used efficiently.
- Confirm animation cap triggers correctly.
**Exact `TODO.md` entries to refresh from this phase**:
- [ ] Implement `getChebyshevDistance(origin, target)` helper.
- [ ] Create `animateRevealQueue()` to stagger tile pops based on distance.
- [ ] Add CSS transitions/animations for the "pop" effect.
- [ ] Implement the 15-wave animation cap (stagger ends, remaining reveal instantly).
- [ ] Verify `will-change` is applied only during active animation cycles.
**Exit criteria for moving items to `DONE.md`**:
- Empty tiles trigger a staggered ripple reveal.
- Performance remains stable on all board sizes.

### Phase 4: Input & Chording System
**Goal**: Implement robust desktop/mobile controls and chording validation.
**Scope**: Right-click to flag, Flag Toggle for mobile, and advanced chording logic.
**Expected files to change**:
- `js/ui.js`
- `js/engine.js`
**Dependencies**: Phase 3B.
**Risks**: Medium.
**Tests and checks to run**:
- Manual UX check: Chording with correct/incorrect/excessive flags.
- Unit test: Chording logic handles all edge cases.
**Review check before moving work to `DONE.md`**:
- Confirm right-click always flags.
- Verify chording on a number with *too many* flags triggers Game Over.
**Exact `TODO.md` entries to refresh from this phase**:
- [ ] Add Right-click event listener for flagging.
- [ ] Implement "Flag Mode" toggle and border color shift.
- [ ] Implement chording logic in `js/engine.js`.
- [ ] Add specific test case: Chording with excessive flags = Game Over.
- [ ] Add specific test case: Chording with correct flags = Reveal neighbors.
**Exit criteria for moving items to `DONE.md`**:
- Full control scheme functional on desktop and mobile.

### Phase 5: Persistence & UI Refinement
**Goal**: Finalize minimalist aesthetics and implement stats tracking.
**Scope**: LocalStorage, Difficulty selection, High Contrast stub, and final CSS.
**Expected files to change**:
- `js/storage.js`
- `js/ui.js`
- `style.css`
- `index.html`
**Dependencies**: Phase 4.
**Risks**: Low.
**Tests and checks to run**:
- Manual check: Personal bests persist after refresh.
- Accessibility check: Number color luminosities.
**Review check before moving work to `DONE.md`**:
- Verify minimalist style (no beveled edges).
- Confirm High Contrast setting is stubbed in `localStorage` for future-proofing.
**Exact `TODO.md` entries to refresh from this phase**:
- [ ] Implement `js/storage.js` for JSON-based stat persistence.
- [ ] Add Difficulty selection menu to UI.
- [ ] Finalize Inter font and typography.
- [ ] Implement quick restart (Space/R keys) and long-press reset.
- [ ] Stub `highContrast: false` in the initial storage schema.
**Exit criteria for moving items to `DONE.md`**:
- Stats persist and visual requirements are met.

### Phase 6: Stabilization & Final Review
**Goal**: Final polish and verification against all Acceptance Criteria.
**Scope**: Bug fixing and final audit.
**Expected files to change**:
- `DONE.md`
- `TODO.md`
- `README.md`
**Dependencies**: All previous phases.
**Risks**: Low.
**Tests and checks to run**:
- Full regression test.
- Final build/lint check.
**Review check before moving work to `DONE.md`**:
- Cross-reference with AC 1-5 in REQUIREMENTS.md.
**Exact `TODO.md` entries to refresh from this phase**:
- [ ] Perform final sweep of all game modes.
- [ ] Verify AC 1-5 fulfillment.
- [ ] Update `README.md` with final instructions.
**Exit criteria for moving items to `DONE.md`**:
- All REQUIREMENTS.md criteria met.

## Dependency notes
- `js/engine.js` is the primary dependency for `js/ui.js`.
- Phase 3A (Logic) must be complete and tested before Phase 3B (Animation) starts.

## Review policy
- Phases are designed to be completed in 1-3 hour cycles.
- oversized phases are not allowed; Phase 3 was split specifically to maintain this policy.

## Definition of done for the plan
The project is complete when:
- All 3 difficulty modes are playable.
- First-click death is enabled.
- "Liquid" animations are smooth and capped.
- Chording failure leads to Game Over.
- Stats persist in LocalStorage.
- Codebase passes lint and tests.

## Open questions
- None at this time.
