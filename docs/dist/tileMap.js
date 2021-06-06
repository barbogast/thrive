function index(position) {
  return `${position.q}_${position.r}`;
}
export function fromArray(tiles) {
  return tiles.reduce((prev, current) => {
    prev[index(current.position)] = current;
    return prev;
  }, {});
}
export function findInPos(tileMap, position) {
  return tileMap[index(position)];
}
