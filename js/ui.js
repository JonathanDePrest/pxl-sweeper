import { DIFFICULTIES, TILE_STATES } from './constants.js';
import { generateMines, calculateNeighbors, revealTile } from './engine.js';

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
  const result = revealTile(index, mines, states);
  
  updateUI(result.changed);
  
  if (result.gameOver) {
    // Basic Game Over for Phase 2
    console.log('Game Over!');
  }
}

function updateUI(indices) {
  indices.forEach(index => {
    const tile = gameBoard.children[index];
    const state = states[index];
    
    tile.classList.remove('hidden', 'revealed', 'exploded');
    
    if (state === TILE_STATES.REVEALED) {
      tile.classList.add('revealed');
      const count = counts[index];
      tile.textContent = count > 0 ? count : '';
    } else if (state === TILE_STATES.EXPLODED) {
      tile.classList.add('exploded');
      tile.textContent = '💣';
    }
  });
}

initGame();
