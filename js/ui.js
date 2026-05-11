import { DIFFICULTIES, TILE_STATES, GAME_STATES } from './constants.js';
import { generateMines, calculateNeighbors, revealTile, floodFill, checkWin, chordTile } from './engine.js';
import { getStats, saveGame } from './storage.js';
import { Timer } from './timer.js';
import { AnimationManager } from './animationManager.js';

let currentDifficultyKey = 'BEGINNER';
let currentDifficulty = DIFFICULTIES[currentDifficultyKey];
let mines, counts, states;
let gameState = GAME_STATES.IDLE;
let isFlagModeActive = false;

const gameBoard = document.getElementById('game-board');
const flagToggle = document.getElementById('flag-toggle');
const difficultySelect = document.getElementById('difficulty-select');
const resetButton = document.getElementById('reset-button');
const timerDisplay = document.getElementById('timer');
const bestTimeDisplay = document.getElementById('best-time');

const timer = new Timer((elapsed) => {
  timerDisplay.textContent = elapsed.toString().padStart(3, '0');
});

const animationManager = new AnimationManager((indices) => {
  updateUI(indices);
});

function initGame() {
  const { rows, cols, mines: mineCount } = currentDifficulty;
  const totalCells = rows * cols;
  
  // Reset engine state
  mines = generateMines(mineCount, totalCells);
  counts = calculateNeighbors(mines, cols, rows);
  states = new Uint8Array(totalCells).fill(TILE_STATES.HIDDEN);
  
  // Reset UI state
  gameState = GAME_STATES.IDLE;
  isFlagModeActive = false;
  timer.reset();
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
  
  // Accessibility: Board role
  gameBoard.setAttribute('role', 'grid');
  gameBoard.setAttribute('aria-label', `Minesweeper board, ${cols} columns by ${rows} rows`);
  
  for (let i = 0; i < states.length; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.index = i;
    tile.tabIndex = 0; // Make tiles focusable
    
    // Accessibility: Tile role and coordinates
    const { x, y } = { x: i % cols, y: Math.floor(i / cols) };
    tile.setAttribute('role', 'gridcell');
    tile.setAttribute('aria-label', `Tile at column ${x + 1}, row ${y + 1}`);
    
    tile.addEventListener('click', handleTileClick);
    tile.addEventListener('contextmenu', handleRightClick);
    tile.addEventListener('keydown', handleTileKeyDown);
    gameBoard.appendChild(tile);
  }
}

function handleTileKeyDown(e) {
  const index = parseInt(e.target.dataset.index);
  const { cols, rows } = currentDifficulty;
  const { x, y } = { x: index % cols, y: Math.floor(index / cols) };

  switch (e.key) {
    case 'ArrowRight':
      focusTile(x + 1, y);
      break;
    case 'ArrowLeft':
      focusTile(x - 1, y);
      break;
    case 'ArrowDown':
      focusTile(x, y + 1);
      break;
    case 'ArrowUp':
      focusTile(x, y - 1);
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      handleTileClick({ target: e.target });
      break;
    case 'f':
    case 'F':
      toggleFlag(index);
      break;
  }
}

function focusTile(x, y) {
  const { cols, rows } = currentDifficulty;
  if (x < 0 || x >= cols || y < 0 || y >= rows) return;
  const index = y * cols + x;
  gameBoard.children[index].focus();
}

function handleRightClick(e) {
  e.preventDefault();
  if (gameState === GAME_STATES.WON || gameState === GAME_STATES.LOST) return;
  const index = parseInt(e.target.dataset.index);
  toggleFlag(index);
}

function toggleFlag(index) {
  if (states[index] === TILE_STATES.REVEALED || states[index] === TILE_STATES.EXPLODED) return;
  states[index] = states[index] === TILE_STATES.FLAGGED ? TILE_STATES.HIDDEN : TILE_STATES.FLAGGED;
  updateUI([index]);
}

function handleTileClick(e) {
  if (gameState === GAME_STATES.WON || gameState === GAME_STATES.LOST) return;
  
  const index = parseInt(e.target.dataset.index);
  const { cols, mines: mineCount } = currentDifficulty;
  
  if (gameState === GAME_STATES.IDLE && states[index] === TILE_STATES.HIDDEN && !isFlagModeActive) {
    gameState = GAME_STATES.PLAYING;
    timer.start();
  }

  if (states[index] === TILE_STATES.REVEALED) {
    const result = chordTile(index, mines, counts, states, cols, currentDifficulty.rows);
    if (result.changed.length > 0 || result.gameOver) {
      if (result.gameOver) {
        endGame(GAME_STATES.LOST, index, result.changed);
      } else {
        animationManager.animateReveal(result.changed, index, cols);
        if (checkWin(states, mineCount)) {
          endGame(GAME_STATES.WON);
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
    const expanded = floodFill(index, mines, counts, states, cols, currentDifficulty.rows);
    changedIndices = Array.from(new Set([...changedIndices, ...expanded]));
  }
  
  if (result.gameOver) {
    endGame(GAME_STATES.LOST, index, result.changed);
  } else {
    animationManager.animateReveal(changedIndices, index, cols);
    if (checkWin(states, mineCount)) {
      endGame(GAME_STATES.WON);
    }
  }
}

function endGame(newState, originIndex = null, changed = []) {
  gameState = newState;
  timer.stop();
  const isWin = newState === GAME_STATES.WON;

  if (!isWin && originIndex !== null) {
    const allMines = [];
    for (let i = 0; i < mines.length; i++) {
      if (mines[i] === 1 && states[i] !== TILE_STATES.EXPLODED) {
        states[i] = TILE_STATES.REVEALED;
        allMines.push(i);
      }
    }
    animationManager.animateReveal([...changed, ...allMines], originIndex, currentDifficulty.cols);
  }

  saveGame(currentDifficultyKey, timer.getTime(), isWin);
  if (isWin) {
    updateBestTimeDisplay();
    console.log('You Win! 🎉');
  } else {
    console.log('Game Over! 💣');
  }
}

function updateUI(indices) {
  indices.forEach(index => {
    const tile = gameBoard.children[index];
    const state = states[index];

    tile.classList.remove('hidden', 'revealed', 'exploded', 'flagged', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8');

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
          tile.classList.add(`n${count}`);
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
