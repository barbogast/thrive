import config from './config'

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
  if (config().flatTopped) {
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
  if (config().flatTopped) {
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
  var q = ((2 / 3) * point.x) / config().tileRadius
  var r =
    ((-1 / 3) * point.x + (Math.sqrt(3) / 3) * point.y) / config().tileRadius
  return hexRound({ q, r })
}
