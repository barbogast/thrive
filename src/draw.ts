import config from './config'
import * as hexUtils from './hexUtils'

export function getTilePosition(
  position: hexUtils.OffsetPosition,
): hexUtils.PixelPosition {
  const { row, col } = position
  const left = 250
  const top = 150

  const r = config().tileRadius
  if (config().flatTopped) {
    const height = Math.sqrt(3) * r
    const isOffset = row % 2 !== 0 ? r : 0
    return {
      x: left + row * height,
      y: top + col * (r * 2) + isOffset,
    }
  } else {
    const height = Math.sqrt(3) * r
    const isOffset = col % 2 !== 0 ? r : 0
    return {
      x: left + row * (r * 2) + isOffset,
      y: top + left + col * height,
    }
  }
}

function average(numbers: number[]) {
  const sum = numbers.reduce((a, b) => a + b, 0)
  return sum / numbers.length || 0
}

export function getMiddle(
  positions: hexUtils.OffsetPosition[],
): hexUtils.PixelPosition {
  const pxPositions = positions.map(getTilePosition)
  return {
    x: average(pxPositions.map((pos) => pos.x)),
    y: average(pxPositions.map((pos) => pos.y)),
  }
}
