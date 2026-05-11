import { DIFFICULTIES, TILE_STATES, WAVE_DELAY, ANIMATION_WAVE_CAP, NUMBER_COLORS } from './constants.js';
import { generateMines, calculateNeighbors, revealTile, floodFill, checkWin, getChebyshevDistance, chordTile } from './engine.js';
import { getStats, saveGame } from './storage.js';

let currentDifficultyKey = 'BEGINNER';
let currentDifficulty = DIFFICULTIES[currentDifficultyKey];
let mines, counts, states;
let isFlagModeActive = false;
let gameStarted = false;
let gameOver = false;
let timerInterval = null;
let startTime = 0;
let timeElapsed = 0;

const gameBoard = document.getElementById('game-board');
const flagToggle = document.getElementById('flag-toggle');
const difficultySelect = document.getElementById('difficulty-select');
const resetButton = document.getElementById('reset-button');
const timerDisplay = document.getElementById('timer');
const bestTimeDisplay = document.getElementById('best-time');

function initGame() {
  const { rows, cols, mines: mineCount } = currentDifficulty;
  const totalCells = rows * cols;
  
  // Reset engine state
  mines = generateMines(mineCount, totalCells);
  counts = calculateNeighbors(mines, cols, rows);
  states = new Uint8Array(totalCells).fill(TILE_STATES.HIDDEN);
  
  // Reset UI state
  gameStarted = false;
  gameOver = false;
  isFlagModeActive = false;
  timeElapsed = 0;
  updateTimerDisplay();
  stopTimer();
  updateFlagModeUI();
  updateBestTimeDisplay();
  
  renderGrid();
}

function updateFlagModeUI() {
  if (isFlagModeActive) {
    flagToggle.classList.add('active');
    flagToggle.textContent = 'Flag Mode: ON';
    gameBoard.classList.add('flag-mode');
  } else {
    flagToggle.classList.remove('active');
    flagToggle.textContent = 'Flag Mode: OFF';
    gameBoard.classList.remove('flag-mode');
  }
}

function updateTimerDisplay() {
  timerDisplay.textContent = timeElapsed.toString().padStart(3, '0');
}

function startTimer() {
  if (timerInterval) return;
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    if (timeElapsed > 999) timeElapsed = 999;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateBestTimeDisplay() {
  const stats = getStats().stats[currentDifficultyKey];
  if (stats && stats.bestTime !== null) {
    bestTimeDisplay.textContent = `Best: ${stats.bestTime.toString().padStart(3, '0')}`;
  } else {
    bestTimeDisplay.textContent = 'Best: ---';
  }
}

difficultySelect.addEventListener('change', (e) => {
  currentDifficultyKey = e.target.value;
  currentDifficulty = DIFFICULTIES[currentDifficultyKey];
  initGame();
});

resetButton.addEventListener('click', initGame);

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r' || e.code === 'Space') {
    initGame();
  }
});

flagToggle.addEventListener('click', () => {
  isFlagModeActive = !isFlagModeActive;
  updateFlagModeUI();
});

function renderGrid() {
  const { rows, cols } = currentDifficulty;
  gameBoard.innerHTML = '';
  gameBoard.style.setProperty('--cols', cols);
  gameBoard.style.setProperty('--rows', rows);
  
  for (let i = 0; i < states.length; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.index = i;
    
    tile.addEventListener('click', handleTileClick);
    tile.addEventListener('contextmenu', handleRightClick);
    gameBoard.appendChild(tile);
  }
}

function handleRightClick(e) {
  e.preventDefault();
  if (gameOver) return;
  const index = parseInt(e.target.dataset.index);
  toggleFlag(index);
}

function toggleFlag(index) {
  if (states[index] === TILE_STATES.REVEALED || states[index] === TILE_STATES.EXPLODED) return;
  
  states[index] = states[index] === TILE_STATES.FLAGGED ? TILE_STATES.HIDDEN : TILE_STATES.FLAGGED;
  updateUI([index]);
}

function handleTileClick(e) {
  if (gameOver) return;
  
  const index = parseInt(e.target.dataset.index);
  const { rows, cols, mines: mineCount } = currentDifficulty;
  
  // Start timer on first valid interaction
  if (!gameStarted && states[index] === TILE_STATES.HIDDEN && !isFlagModeActive) {
    gameStarted = true;
    startTimer();
  }

  if (states[index] === TILE_STATES.REVEALED) {
    const result = chordTile(index, mines, counts, states, cols, rows);
    if (result.changed.length > 0 || result.gameOver) {
      if (result.gameOver) {
        handleGameOver(index, result.changed);
      } else {
        animateReveal(result.changed, index);
        if (checkWin(states, mineCount)) {
          handleWin();
        }
      }
    }
    return;
  }

  if (isFlagModeActive) {
    toggleFlag(index);
    return;
  }
  
  if (states[index] === TILE_STATES.FLAGGED) return;

  const result = revealTile(index, mines, states);
  let changedIndices = [...result.changed];
  
  if (!result.gameOver && counts[index] === 0) {
    const expanded = floodFill(index, mines, counts, states, cols, rows);
    changedIndices = Array.from(new Set([...changedIndices, ...expanded]));
  }
  
  if (result.gameOver) {
    handleGameOver(index, result.changed);
  } else {
    animateReveal(changedIndices, index);
    if (checkWin(states, mineCount)) {
      handleWin();
    }
  }
}

function handleGameOver(originIndex, changed) {
  gameOver = true;
  stopTimer();
  
  const allMines = [];
  for (let i = 0; i < mines.length; i++) {
    if (mines[i] === 1 && states[i] !== TILE_STATES.EXPLODED) {
      states[i] = TILE_STATES.REVEALED;
      allMines.push(i);
    }
  }
  animateReveal([...changed, ...allMines], originIndex);
  saveGame(currentDifficultyKey, timeElapsed, false);
  console.log('Game Over! 💣');
}

function handleWin() {
  gameOver = true;
  stopTimer();
  saveGame(currentDifficultyKey, timeElapsed, true);
  updateBestTimeDisplay();
  console.log('You Win! 🎉');
}

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

function updateUI(indices) {
  indices.forEach(index => {
    const tile = gameBoard.children[index];
    const state = states[index];
    
    tile.classList.remove('hidden', 'revealed', 'exploded', 'flagged');
    
    // Manage will-change for performance during animation
    tile.style.willChange = 'transform';
    tile.addEventListener('animationend', () => {
      tile.style.willChange = 'auto';
    }, { once: true });

    if (state === TILE_STATES.REVEALED) {
      tile.classList.add('revealed');
      if (mines[index] === 1) {
        tile.textContent = '💣';
      } else {
        const count = counts[index];
        tile.textContent = count > 0 ? count : '';
        if (count > 0) {
          tile.style.color = NUMBER_COLORS[count] || 'black';
        }
      }
    } else if (state === TILE_STATES.FLAGGED) {
      tile.classList.add('flagged');
      tile.textContent = '🚩';
    } else if (state === TILE_STATES.EXPLODED) {
      tile.classList.add('exploded');
      tile.textContent = '💣';
    }
  });
}

initGame();
