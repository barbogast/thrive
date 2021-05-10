import config from './config'
import * as hexUtils from './hexUtils'
import * as utils from './utils'

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

export function getMiddle(
  positions: hexUtils.OffsetPosition[],
): hexUtils.PixelPosition {
  const pxPositions = positions.map(getTilePosition)
  return {
    x: utils.average(pxPositions.map((pos) => pos.x)),
    y: utils.average(pxPositions.map((pos) => pos.y)),
  }
}
