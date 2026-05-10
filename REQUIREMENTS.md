# REQUIREMENTS.md: PXL Sweep

## 1. Project Overview
A high-stakes, single-page web app Minesweeper clone focused on modern aesthetics and hardcore gameplay. The goal is a distraction-free, high-fidelity experience that balances "Zen" visuals with uncompromising mechanics.

## 2. Player Goal
The player must reveal all tiles on a grid that do not contain a naval mine. Success is achieved when the number of hidden tiles exactly matches the number of mines programmed into the level. Victory is determined by tile state, not flag placement.

## 3. The Game Loop
1.  **Initialization:** The board is generated with a randomized mine distribution immediately upon load.
2.  **Interaction:** The player selects a tile to reveal or flag.
3.  **Evaluation:**
    * If a **Mine** is revealed: The game ends immediately (**Defeat**). All mines ripple-reveal.
    * If a **Number** is revealed: The player uses that hint to deduce surrounding mines.
    * If an **Empty Space** is revealed: A "liquid" recursive reveal clears the surrounding safe area.
4.  **Conclusion:** The loop repeats until the win condition is met or a mine explodes.

## 4. In-Scope Features
### 4.1 Core Mechanics
* **Hardcore Start:** No safety net. First-click death is enabled; the grid is generated before the first interaction.
* **Chording:** Clicking a revealed number clears surrounding tiles if adjacent flags match the number.
    * **Failure State:** Incorrect flags trigger a Game Over upon chording.
* **Difficulty Presets:**
    * **Beginner:** 9 x 9 (10 mines)
    * **Intermediate:** 16 x 16 (40 mines)
    * **Expert:** 30 x 16 (99 mines)

### 4.2 Visuals & UX
* **Theme:** Modern Minimalism. Flat colors, no beveled edges, high-contrast typography.
* **Liquid Animations:** Tiles scale-pop (0 to 1) with a staggered delay based on Chebyshev distance from click.
    * **Animation Cap:** After 15 waves, remaining tiles trigger simultaneously to maintain performance.
* **Assets:** Classic black naval mine vector icon.
* **Responsive UI:** Dedicated "Flag Mode" toggle for touch users; border shifts color when active.

### 4.3 Technical Features
* **Persistence:** `localStorage` using a structured JSON schema for Personal Bests and attempts.
* **GPU Acceleration:** Use of `will-change: transform` for 60fps animations.

## 5. Out-of-Scope Features
* **No-Guess Boards:** Boards may require 50/50 guesses (v2 feature).
* **Sound Design:** The game is strictly silent.
* **Global Leaderboards:** Local stats only.
* **Themes:** No custom skins or Dark Mode in MVP.

## 6. Control Scheme
| Action | Desktop (Mouse/KB) | Mobile (Touch) |
| :--- | :--- | :--- |
| **Reveal Tile** | Left-Click | Tap (Flag Toggle OFF) |
| **Flag Tile** | Right-Click | Tap (Flag Toggle ON) |
| **Chord** | Left-Click (on number) | Tap (on number) |
| **Quick Restart** | Spacebar or R key | Long-press Reset Button |

*Note: Right-click always flags on desktop regardless of toggle state.*

## 7. Technical Architecture
* **State Management:** 1D Flat Array of objects.
    * States: `0: HIDDEN`, `1: REVEALED`, `2: FLAGGED`, `3: EXPLODED`.
* **Coordinate Mapping:** `x = index % width`; `y = floor(index / width)`.
* **Algorithm:** Recursive flood-fill with depth-based `setTimeout` or RequestAnimationFrame queue.

## 8. Browser Assumptions
* Modern Chromium, WebKit, or Gecko browsers.
* Support for CSS Grid, CSS Variables, and `localStorage`.

## 9. Acceptance Criteria
* **AC 1:** First click can hit a mine.
* **AC 2:** Empty areas clear with a "liquid" staggered animation.
* **AC 3:** Faulty chording results in immediate Game Over.
* **AC 4:** Personal Bests persist across sessions.
* **AC 5:** Fully functional on mobile viewports via Flag Toggle.

## Project Setup Requirements

- The project shall include a `package.json` file in the repository root.
- The `package.json` file shall define the project's runnable commands in a consistent way.
- The `package.json` file shall include at least a `test` script so the same test command can be run every time.
- If the project uses ES module imports in JavaScript, `package.json` shall set `"type": "module"`.
- The project shall remain compatible with a plain JavaScript, static-site workflow.