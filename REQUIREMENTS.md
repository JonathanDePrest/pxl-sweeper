# Functional Requirements Document: Modern Minimalist Minesweeper

This document outlines the final technical and functional specifications for the Modern Minimalist Minesweeper web application, incorporating the Senior Architect audit and UX refinements.

---

## 1. Project Overview
A high-stakes, single-page web application (SPA) focused on a clean, "Zen" aesthetic paired with uncompromising "Hardcore" mechanics. The goal is a distraction-free experience that rewards precision and speed.

---

## 2. Functional Requirements

### 2.1 Gameplay Logic
* **Hardcore Start:** The minefield is generated entirely at random upon page load. No safety logic exists for the first click; hitting a mine on the first move results in an immediate Game Over.
* **Chording:**
    * If a revealed number tile is clicked and its adjacent flags match its number, all surrounding non-flagged tiles are revealed.
    * **Failure State:** If adjacent flags are placed incorrectly, chording triggers a Game Over for the misidentified safe tiles.
* **Win Condition:** Success is achieved when `RevealedTiles == (TotalTiles - MineCount)`. Flagging all mines is encouraged but not required for victory.
* **Difficulty Toggles:**
    * **Beginner:** 9 x 9 (10 mines)
    * **Intermediate:** 16 x 16 (40 mines)
    * **Expert:** 30 x 16 (99 mines)

### 2.2 User Interaction
* **Input Hierarchy:**
    * **Desktop:** Left-click to reveal; Right-click to flag. Right-click always flags regardless of toggle state.
    * **Mobile/Touch:** A dedicated **Flag Mode** toggle. When active, primary taps place flags.
* **Feedback:** The board border shifts color (e.g., to an indigo accent) when Flag Mode is active.
* **Quick Restart:** Instant board reset via "Spacebar," "R" key, or a long-press on the reset button.

---

## 3. User Interface & UX

### 3.1 Aesthetics
* **Minimalism:** Flat design, no beveled edges, high-contrast sans-serif typography.
* **The Mine:** A classic black Naval Mine vector icon.
* **Color Palette:**
    * **Background:** White/Light Gray.
    * **Numbers:** Distinct luminosities for each number (1–8) to ensure accessibility for color-blind users.
    * **GPU Acceleration:** Use `will-change: transform;` for all tiles to ensure 60fps animations.

### 3.2 Liquid Animations
* **Staggered Reveal:** Tiles scale-pop (0 to 1) when revealed.
* **Ripple Logic:** Delay is calculated based on Chebyshev distance from the click source.
* **Animation Cap:** If a reveal chain exceeds 15 steps (Waves), all remaining tiles trigger simultaneously to prevent excessive wait times on larger boards.

---

## 4. Technical Architecture

### 4.1 State Management
The board is managed as a **Flat Array (1D)** of objects for easier coordinate mapping and distance calculation.
* **Tile States:** `0: HIDDEN`, `1: REVEALED`, `2: FLAGGED`, `3: EXPLODED`.
* **Coordinate Mapping:**
    * x = index % width
    * y = floor(index / width)

### 4.2 Persistence (localStorage)
Data is stored as a structured JSON object to allow for future statistical tracking.

```json
{
  "version": "1.0",
  "stats": {
    "beginner": { "bestTime": 0, "gamesWon": 0, "totalAttempts": 0 },
    "intermediate": { "bestTime": 0, "gamesWon": 0, "totalAttempts": 0 },
    "expert": { "bestTime": 0, "gamesWon": 0, "totalAttempts": 0 }
  },
  "settings": { "highContrast": false }
}
```

### 4.3 Styling Guide (CSS Variables)
```css
:root {
  --bg-main: #ffffff;
  --tile-hidden: #e2e8f0;
  --tile-revealed: #f8fafc;
  --accent-active: #3b82f6; /* Flag Mode indicator */
  --mine-dark: #1e293b;
  --font-main: 'Inter', sans-serif;
}
```

---

## 5. Future Roadmap
* **No-Guess Generation:** Optional mode ensuring every board is solvable via pure logic.
* **Dark Mode:** Alternate color variable set for night-time play.
* **Global Best:** Cloud-synced leaderboards.
