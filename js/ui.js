import { DIFFICULTIES, TILE_STATES, WAVE_DELAY, ANIMATION_WAVE_CAP } from './constants.js';
import { generateMines, calculateNeighbors, revealTile, floodFill, checkWin, getChebyshevDistance } from './engine.js';

let currentDifficulty = DIFFICULTIES.BEGINNER;
let mines, counts, states;

const gameBoard = document.getElementById('game-board');

function initGame() {
  const { rows, cols, mines: mineCount } = currentDifficulty;
  const totalCells = rows * cols;
  
  mines = generateMines(mineCount, totalCells);
  counts = calculateNeighbors(mines, cols, rows);
  states = new Uint8Array(totalCells).fill(TILE_STATES.HIDDEN);
  
  renderGrid();
}

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
    gameBoard.appendChild(tile);
  }
}

function handleTileClick(e) {
  const index = parseInt(e.target.dataset.index);
  const { rows, cols, mines: mineCount } = currentDifficulty;
  
  if (states[index] !== TILE_STATES.HIDDEN) return;
  
  const result = revealTile(index, mines, states);
  let changedIndices = [...result.changed];
  
  if (!result.gameOver && counts[index] === 0) {
    const expanded = floodFill(index, mines, counts, states, cols, rows);
    changedIndices = Array.from(new Set([...changedIndices, ...expanded]));
  }
  
  if (result.gameOver) {
    const allMines = [];
    for (let i = 0; i < mines.length; i++) {
      if (mines[i] === 1 && i !== index) {
        states[i] = TILE_STATES.REVEALED;
        allMines.push(i);
      }
    }
    animateReveal([...result.changed, ...allMines], index);
    console.log('Game Over! 💣');
  } else {
    animateReveal(changedIndices, index);
    if (checkWin(states, mineCount)) {
      console.log('You Win! 🎉');
    }
  }
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
    
    tile.classList.remove('hidden', 'revealed', 'exploded');
    
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
      }
    } else if (state === TILE_STATES.EXPLODED) {
      tile.classList.add('exploded');
      tile.textContent = '💣';
    }
  });
}

initGame();
