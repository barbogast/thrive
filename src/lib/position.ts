import * as axial from './axial'
import * as utils from './utils'

export type Position = axial.Coordinate[]

function sortPositions(positions: axial.Coordinate[]) {
  return [...positions].sort((a, b) => {
    if (a.q === b.q) {
      return a.r > b.r ? 1 : -1
    }
    return a.q > b.q ? 1 : -1
  })
}

export function createPosition(positions: axial.Coordinate[]): Position {
  return sortPositions(positions)
}

export function comparePositions(posA: Position, posB: Position): boolean {
  // We assume that all positions have been created in a sorted manner.
  // This way we can just compare the coordinates of each index
  utils.assert(() => posA.length === posB.length)
  for (let i = 0; i < posA.length; i++) {
    if (!axial.compareCoordinates(posA[i], posB[i])) {
      return false
    }
  }
  return true
}

// Returns true if all coordinates in partialPosition can be found in fullPosition,
// even though partialPosition might not have all coordinates in fullPosition
export function comparePartialPosition(
  fullPosition: Position,
  partialPosition: Position,
): boolean {
  for (const coord of partialPosition) {
    if (!fullPosition.find((c) => axial.compareCoordinates(c, coord))) {
      return false
    }
  }
  return true
}
