# IMPLEMENTATION_PHASE3B.md: Ripple Orchestration

## 1. Architectural Design

### 1.1 Distance-Based Staggering
The "Liquid" reveal effect uses **Chebyshev distance** to determine the delay for each tile in a reveal operation (flood fill or mine reveal).
- **Distance Formula**: `d = max(|x1 - x2|, |y1 - y2|)`
- **Delay Formula**: `delay = Math.min(d, ANIMATION_WAVE_CAP) * WAVE_DELAY`
- **Animation Wave Cap**: 15 waves. All tiles at distance ≥ 15 trigger at the same time as the 15th wave.
- **Wave Delay**: Target ~60ms per wave for a smooth "liquid" feel.

### 1.2 Animation State Management
To maintain performance (60fps):
- Use `will-change: transform` only during the animation cycle.
- Use CSS keyframes for the "pop" effect (scale 0 to 1).
- Group tiles by distance before scheduling `setTimeout` calls to minimize the number of timers.

### 1.3 Function Signatures
- `js/engine.js`: `getChebyshevDistance(idx1, idx2, width)`
- `js/ui.js`: `animateReveal(indices, originIndex)`

## 2. File-Level Strategy

| File | Responsibility |
| :--- | :--- |
| `js/constants.js` | Define `WAVE_DELAY = 60` and `ANIMATION_WAVE_CAP = 15`. |
| `js/engine.js` | Implement `getChebyshevDistance`. |
| `js/engine.test.js` | Unit tests for Chebyshev distance. |
| `style.css` | Add `pop` keyframes, `will-change` logic, and transition/animation styles. |
| `js/ui.js` | Replace immediate `updateUI` with `animateReveal` staggering logic. |

## 3. Atomic Execution Steps

### 3.1 Chebyshev Distance Helper
- **Plan**: Add coordinate-based distance calculation to the engine.
- **Act**: 
    - Implement `getChebyshevDistance` in `js/engine.js`.
    - Export it for use in UI.
- **Validate**: Unit tests in `js/engine.test.js` covering orthogonal, diagonal, and capped distances.

### 3.2 CSS Pop Animation
- **Plan**: Create the "scale-pop" visual effect.
- **Act**:
    - Add `@keyframes pxl-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`.
    - Add `.tile.revealed { animation: pxl-pop 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275); }`.
    - Ensure `will-change: transform` is active during the animation.
- **Validate**: Manually toggle the `revealed` class on a tile in dev tools.

### 3.3 Orchestrate Staggered Reveal
- **Plan**: Group changed indices by distance and schedule their UI updates.
- **Act**:
    - Modify `js/ui.js` to implement `animateReveal(indices, originIndex)`.
    - Use `setTimeout` for each distance group.
    - Handle mine reveal ripple by passing all mine indices to `animateReveal` when a mine is hit.
- **Validate**: Click an empty area and verify the reveal "ripples" outward from the click.

### 3.4 Animation Performance & Cap
- **Plan**: Implement the 15-wave limit and verify performance.
- **Act**:
    - Clamp the distance group delay at `ANIMATION_WAVE_CAP * WAVE_DELAY`.
    - Ensure all tiles in the 15+ group reveal simultaneously.
- **Validate**: On an Expert board, click a corner; verify the animation speeds up/ends after the 15th wave.

## 4. Edge Case & Boundary Audit
- **Rapid Input**: If a user clicks another tile while an animation is running, the new animation should start independently. Tiles already being revealed will finish their animation.
- **Game Over Ripple**: When a mine is clicked, the click index is the origin, and all other mines are the `indices` to reveal.
- **Win Condition timing**: Win/Loss messages should ideally trigger after the last animation wave finishes to avoid jarring alerts interrupting the visual flow.

## 5. Verification Protocol
1. **Automated Tests**:
    - `getChebyshevDistance(0, 10, 9)` (diagonal) returns `1`.
    - `getChebyshevDistance(0, 20, 9)` returns `2`.
2. **Manual UX Checks**:
    - **Ripple Origin**: Verify the reveal always starts at the clicked tile.
    - **Smoothness**: 60fps during clear.
    - **Cap**: Verify large clears on Expert boards don't take too long (capped at ~900ms).
3. **Mines Ripple**: Hit a mine; verify all mines reveal in a ripple pattern from the explosion point.

## 6. Code Scaffolding

### Chebyshev Distance (engine.js)
```javascript
export function getChebyshevDistance(idx1, idx2, width) {
  const p1 = indexToXY(idx1, width);
  const p2 = indexToXY(idx2, width);
  return Math.max(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
}
```

### Animation Orchestration (ui.js)
```javascript
function animateReveal(indices, originIndex) {
  const { cols } = currentDifficulty;
  const groups = new Map();

  indices.forEach(idx => {
    const d = getChebyshevDistance(originIndex, idx, cols);
    const wave = Math.min(d, ANIMATION_WAVE_CAP);
    if (!groups.has(wave)) groups.set(wave, []);
    groups.get(wave).push(idx);
  });

  groups.forEach((groupIndices, wave) => {
    setTimeout(() => {
      updateUI(groupIndices);
    }, wave * WAVE_DELAY);
  });
}
```
