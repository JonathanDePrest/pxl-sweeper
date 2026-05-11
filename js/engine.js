import { TILE_STATES } from './constants.js';

export function indexToXY(index, width) {
  return {
    x: index % width,
    y: Math.floor(index / width)
  };
}

export function XYToIndex(x, y, width) {
  if (x < 0 || x >= width || y < 0) return -1;
  return y * width + x;
}

export function generateMines(count, totalCells) {
  const mines = new Uint8Array(totalCells);
  const indices = Array.from({ length: totalCells }, (_, i) => i);
  
  // Fisher-Yates Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // Pick first 'count' indices
  for (let i = 0; i < count; i++) {
    mines[indices[i]] = 1;
  }
  
  return mines;
}

export function calculateNeighbors(mines, width, height) {
  const counts = new Int8Array(mines.length);
  
  for (let i = 0; i < mines.length; i++) {
    if (mines[i] === 1) continue;
    
    const { x, y } = indexToXY(i, width);
    let count = 0;
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIndex = XYToIndex(nx, ny, width);
          if (mines[nIndex] === 1) {
            count++;
          }
        }
      }
    }
    counts[i] = count;
  }
  
  return counts;
}

export function revealTile(index, mines, states) {
  if (states[index] !== TILE_STATES.HIDDEN) {
    return { gameOver: false, changed: [] };
  }
  
  if (mines[index] === 1) {
    states[index] = TILE_STATES.EXPLODED;
    return { gameOver: true, changed: [index] };
  }
  
  states[index] = TILE_STATES.REVEALED;
  return { gameOver: false, changed: [index] };
}
