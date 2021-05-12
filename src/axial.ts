import { visualConfig } from './constants'

export type PixelCoordinate = {
  x: number
  y: number
}

export type OffsetCoordinate = {
  row: number
  col: number
}

export type Coordinate = {
  q: number
  r: number
}

export function offsetToAxial({ row, col }: OffsetCoordinate): Coordinate {
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

export function axialToOffset({ q, r }: Coordinate): OffsetCoordinate {
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

const directions: Coordinate[] = [
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
]
export function getNeighbor(
  // https://www.redblobgames.com/grids/hexagons/#neighbors-axial
  origin: Coordinate,
  direction: Direction,
): Coordinate {
  const dir = directions[direction]
  return { q: origin.q + dir.q, r: origin.r + dir.r }
}

export function getDirection(pos1: Coordinate, pos2: Coordinate): Direction {
  const dir = directions.findIndex(
    (d) => d.q === pos1.q - pos2.q && d.r === pos1.r - pos2.r,
  )
  if (dir === -1) {
    throw new Error('positions are not neighboring')
  }
  return dir as Direction
}

export function compareCoordinates(
  coord1: Coordinate,
  coord2: Coordinate,
): boolean {
  return coord1.q === coord2.q && coord1.r === coord2.r
}
