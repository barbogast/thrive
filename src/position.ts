import * as hexUtils from './hexUtils'
import * as utils from './utils'

export type Position = hexUtils.AxialPosition[]

function sortPositions(positions: hexUtils.AxialPosition[]) {
  return [...positions].sort((a, b) => {
    if (a.q === b.q) {
      return a.r > b.r ? 1 : -1
    }
    return a.q > b.q ? 1 : -1
  })
}

export function createPosition(positions: hexUtils.AxialPosition[]): Position {
  return sortPositions(positions)
}

export function comparePositions(posA: Position, posB: Position) {
  // We assume that all positions have been created in a sorted manner.
  // This way we can just compare the coordinates of each index
  utils.assert(() => posA.length === posB.length)
  for (let i = 0; i < posA.length; i++) {
    if (!hexUtils.compareCoordinates(posA[i], posB[i])) {
      return false
    }
  }
  return true
}
