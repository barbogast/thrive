import { visualConfig } from './constants'

export type PixelPosition = {
  x: number
  y: number
}

export type OffsetPosition = {
  row: number
  col: number
}

export type AxialPosition = {
  q: number
  r: number
}

export function offsetToAxial({ row, col }: OffsetPosition): AxialPosition {
  if (visualConfig().flatTopped) {
    return {
      q: row,
      r: col - (row - (row & 1)) / 2,
    }
  } else {
    return {
      q: row - (col - (col & 1)) / 2,
      r: col,
    }
  }
}

export function axialToOffset({ q, r }: AxialPosition): OffsetPosition {
  if (visualConfig().flatTopped) {
    return {
      row: q,
      col: r + (q - (q & 1)) / 2,
    }
  } else {
    return {
      row: q + (r - (r & 1)) / 2,
      col: r,
    }
  }
}

export type Direction = 0 | 1 | 2 | 3 | 4 | 5
export const allDirections: Direction[] = [0, 1, 2, 3, 4, 5]

const directions: AxialPosition[] = [
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
]
export function getNeighbor(
  // https://www.redblobgames.com/grids/hexagons/#neighbors-axial
  origin: AxialPosition,
  direction: Direction,
): AxialPosition {
  const dir = directions[direction]
  return { q: origin.q + dir.q, r: origin.r + dir.r }
}

export function getDirection(
  pos1: AxialPosition,
  pos2: AxialPosition,
): Direction {
  const dir = directions.findIndex(
    (d) => d.q === pos1.q - pos2.q && d.r === pos1.r - pos2.r,
  )
  if (dir === -1) {
    throw new Error('positions are not neighboring')
  }
  return dir as Direction
}

export function compareCoordinates(
  coord1: AxialPosition,
  coord2: AxialPosition,
): boolean {
  return coord1.q === coord2.q && coord1.r === coord2.r
}
