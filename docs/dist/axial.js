import {visualConfig} from "./constants.js";
import * as utils from "./utils.js";
export function offsetToAxial({row, col}) {
  if (visualConfig().flatTopped) {
    return {
      q: row,
      r: col - (row - (row & 1)) / 2
    };
  } else {
    return {
      q: row - (col - (col & 1)) / 2,
      r: col
    };
  }
}
export function axialToOffset({q, r}) {
  if (visualConfig().flatTopped) {
    return {
      row: q,
      col: r + (q - (q & 1)) / 2
    };
  } else {
    return {
      row: q + (r - (r & 1)) / 2,
      col: r
    };
  }
}
export const allDirections = [0, 1, 2, 3, 4, 5];
const directions = [
  {q: 1, r: 0},
  {q: 0, r: 1},
  {q: -1, r: 1},
  {q: -1, r: 0},
  {q: 0, r: -1},
  {q: 1, r: -1}
];
export function getNeighbor(origin, direction) {
  const dir = directions[direction];
  return {q: origin.q + dir.q, r: origin.r + dir.r};
}
export function getDirection(pos1, pos2) {
  const dir = directions.findIndex((d) => d.q === pos1.q - pos2.q && d.r === pos1.r - pos2.r);
  if (dir === -1) {
    throw new Error("positions are not neighboring");
  }
  return dir;
}
export function compareCoordinates(coord1, coord2) {
  return coord1.q === coord2.q && coord1.r === coord2.r;
}
export function getTilePosition(position) {
  const {row, col} = axialToOffset(position);
  const left = 250;
  const top = 150;
  const r = visualConfig().tileRadius;
  if (visualConfig().flatTopped) {
    const height = Math.sqrt(3) * r;
    const isOffset = row % 2 !== 0 ? r : 0;
    return {
      x: left + row * height,
      y: top + col * (r * 2) + isOffset
    };
  } else {
    const height = Math.sqrt(3) * r;
    const isOffset = col % 2 !== 0 ? r : 0;
    return {
      x: left + row * (r * 2) + isOffset,
      y: top + left + col * height
    };
  }
}
export function getMiddle(positions) {
  const pxPositions = positions.map(getTilePosition);
  return {
    x: utils.average(pxPositions.map((pos) => pos.x)),
    y: utils.average(pxPositions.map((pos) => pos.y))
  };
}
