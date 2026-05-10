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
