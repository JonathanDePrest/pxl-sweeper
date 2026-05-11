# CODE_REVIEW.md: PXL Sweeper Technical Audit

## Executive Summary
**Score: 8.5 / 10**  
PXL Sweeper is a masterclass in performance-oriented minimalist design, leveraging 1D flat arrays and Chebyshev-based animations to achieve high-fidelity "Liquid" effects. While the core engine is architecturally sound and highly testable, the UI layer borders on a "God Object" and requires better accessibility (ARIA) and granular state decoupling to reach production-grade maturity.

---

## Architecture & Design
- **Separation of Concerns**: The engine (`js/engine.js`) is effectively decoupled from the UI, consisting of pure, stateless functions. This is excellent for testability.
- **State Management**: Using a **1D Flat Array** (`Uint8Array`, `Int8Array`) for grid state and mine mapping is a high-signal engineering choice that optimizes memory and lookup speed (O(1)).
- **Pattern Adherence**:
    - **KISS**: The project avoids over-engineering; there are no heavy frameworks or unnecessary abstractions.
    - **DRY**: Logic for mine reveals is slightly duplicated in `handleGameOver` and the chording reveal path.
    - **SOLID**: `ui.js` violates the Single Responsibility Principle by managing DOM, Timer logic, Animation Queues, and Input handling simultaneously.

---

## Implementation & Code Quality
- **Performance**: Use of typed arrays (`Uint8Array`) and `will-change: transform` management demonstrates deep understanding of browser rendering cycles.
- **Naming Quality**: Function names like `getChebyshevDistance` and `chordTile` are precise and idiomatic.
- **Magic Numbers**: Most constants are centralized in `js/constants.js`. However, some color logic and "15-wave" magic numbers are occasionally repeated or hardcoded in CSS/JS instead of fully dynamic variables.
- **Code Smells**:
    - **Long Methods**: `handleTileClick` is becoming a complex branch-heavy method.
    - **Primitive Obsession**: The "Difficulty" is passed as a key or an object; standardizing on a class or a robust Enum-like structure would improve safety.

---

## Testing & Stability
- **Infrastructure**: Utilizing the native Node.js test runner is a forward-thinking choice that reduces dependency bloat.
- **AAA Pattern**: All tests in `js/engine.test.js` strictly follow Arrange-Act-Assert, making them readable and maintainable.
- **Coverage**:
    - **Logical Boundary**: Excellent coverage of `XYToIndex` boundaries and Chording edge cases (excessive flags).
    - **Gaps**: There is no automated coverage for the `storage.js` module or UI-driven integration tests (e.g., ensuring the timer stops precisely on win).

---

## UX & Accessibility
- **Interaction Feedback**: The "Liquid" animation system provides premium tactile feedback.
- **Performance**: Target 60fps is consistently met due to efficient CSS keyframes and staggered `setTimeout` grouping.
- **Accessibility (Critical Gap)**:
    - Tiles are `<div>` elements without `role="gridcell"` or `aria-label`.
    - No keyboard navigation for the grid (cannot play without a mouse/touch).
    - Color contrast for some number hints (e.g., yellow '7') may not meet WCAG AA standards.

---

## Error Handling & Logic Integrity
- **Hardcore Start**: Verified. Mine generation occurs during `initGame`, satisfying the requirement for first-click death potential.
- **Fail-Fast**: The chording logic correctly triggers an immediate Game Over on invalid inputs (excessive flags), preventing "lazy" play.
- **Integrity**: `storage.js` uses `try/catch` for JSON parsing, which is a vital safeguard against corrupted `localStorage`.

---

## Actionable Recommendations

### 1. Architectural Refactoring (High Priority)
- **Decouple UI Logic**: Extract the Timer into a `Timer` class and the animation orchestration into an `AnimationManager`.
- **Centralize State**: Replace the boolean `gameOver` and `gameStarted` flags with a single `GameState` enum (`IDLE`, `PLAYING`, `WON`, `LOST`).

### 2. Accessibility & A11y (High Priority)
- **ARIA Implementation**: Add `role="grid"` to the board and `role="gridcell"` to tiles.
- **Keyboard Navigation**: Implement arrow key navigation for tiles and `Enter`/`Space` for reveal, `F` for flagging.

### 3. Code Quality (Medium Priority)
- **CSS Variables**: Move `NUMBER_COLORS` from `constants.js` into CSS variables (e.g., `--color-1`, `--color-2`) to keep styling in the stylesheet.
- **Unified Reveal Logic**: Consolidate mine-reveal loops into a single `revealAllMines(originIndex)` helper in `ui.js`.

### 4. Testing Expansion (Medium Priority)
- **Integration Suite**: Implement the planned tests in `tests/integration/` specifically for `storage.js` and `Timer` accuracy.
