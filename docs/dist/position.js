import * as axial from "./axial.js";
import * as utils from "./utils.js";
function sortPositions(positions) {
  return [...positions].sort((a, b) => {
    if (a.q === b.q) {
      return a.r > b.r ? 1 : -1;
    }
    return a.q > b.q ? 1 : -1;
  });
}
export function createPosition(positions) {
  return sortPositions(positions);
}
export function comparePositions(posA, posB) {
  utils.assert(() => posA.length === posB.length);
  for (let i = 0; i < posA.length; i++) {
    if (!axial.compareCoordinates(posA[i], posB[i])) {
      return false;
    }
  }
  return true;
}
export function comparePartialPosition(fullPosition, partialPosition) {
  for (const coord of partialPosition) {
    if (!fullPosition.find((c) => axial.compareCoordinates(c, coord))) {
      return false;
    }
  }
  return true;
}
