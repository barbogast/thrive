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

export type CubePosition = {
  x: number
  y: number
  z: number
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

export function cubeToAxial(cube: CubePosition): AxialPosition {
  var q = cube.x
  var r = cube.z
  return { q, r }
}

export function axialToCube(pos: AxialPosition): CubePosition {
  var x = pos.q
  var z = pos.r
  var y = -x - z
  return { x, y, z }
}

function cubeRound(cube: CubePosition): CubePosition {
  // https://www.redblobgames.com/grids/hexagons/#rounding
  var rx = Math.round(cube.x)
  var ry = Math.round(cube.y)
  var rz = Math.round(cube.z)

  var x_diff = Math.abs(rx - cube.x)
  var y_diff = Math.abs(ry - cube.y)
  var z_diff = Math.abs(rz - cube.z)

  if (x_diff > y_diff && x_diff > z_diff) {
    rx = -ry - rz
  } else if (y_diff > z_diff) {
    ry = -rx - rz
  } else {
    rz = -rx - ry
  }

  return { x: rx, y: ry, z: rz }
}

function hexRound(pos: AxialPosition): AxialPosition {
  // https://www.redblobgames.com/grids/hexagons/#rounding
  return cubeToAxial(cubeRound(axialToCube(pos)))
}

function pixelToFlatHex(point: PixelPosition): AxialPosition {
  var q = ((2 / 3) * point.x) / visualConfig().tileRadius
  var r =
    ((-1 / 3) * point.x + (Math.sqrt(3) / 3) * point.y) /
    visualConfig().tileRadius
  return hexRound({ q, r })
}

export type Direction = 0 | 1 | 2 | 3 | 4 | 5
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
