# PXL Sweep

A high-stakes, minimalist Minesweeper clone focused on modern aesthetics and hardcore mechanics.

## 🚀 Features

- **Hardcore Start**: No safety net. The first click can hit a mine. The grid is generated before you even start.
- **Liquid Animations**: Experience a staggered "ripple" reveal based on Chebyshev distance from your click.
- **Advanced Chording**: Click on a revealed number to clear surrounding tiles if you've placed the correct number of flags.
  - **Note**: Excessive flags = Immediate Game Over.
- **Persistence**: Your personal bests and total attempts are saved automatically to `localStorage`.
- **Difficulty Presets**:
  - **Beginner**: 9x9 (10 mines)
  - **Intermediate**: 16x16 (40 mines)
  - **Expert**: 30x16 (99 mines)
- **Responsive Design**: Dedicated "Flag Mode" for touch devices.

## 🎮 Controls

| Action | Desktop (Mouse/KB) | Mobile (Touch) |
| :--- | :--- | :--- |
| **Reveal Tile** | Left-Click | Tap (Flag Toggle OFF) |
| **Flag Tile** | Right-Click | Tap (Flag Toggle ON) |
| **Chord** | Left-Click (on number) | Tap (on number) |
| **Quick Restart** | `Space` or `R` key | Reset Button |

## 🛠 Technical Highlights

- **Architecture**: 1D Flat Array state management for high-performance grid operations.
- **Performance**: GPU-accelerated animations using `will-change: transform` and CSS Grid.
- **Animation Orchestration**: Chebyshev distance-based wave system with a 15-wave performance cap.
- **Testing**: Built with the native Node.js test runner.

## 🧪 Testing

To run the unit tests, ensure you have Node.js installed and run:

```bash
npm test
```

## 📜 License

MIT
