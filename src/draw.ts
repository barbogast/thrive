import { visualConfig } from './constants'
import * as axial from './axial'
import * as utils from './utils'

export function getTilePosition(
  position: axial.AxialPosition,
): axial.PixelPosition {
  const { row, col } = axial.axialToOffset(position)
  const left = 250
  const top = 150

  const r = visualConfig().tileRadius
  if (visualConfig().flatTopped) {
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
  positions: axial.AxialPosition[],
): axial.PixelPosition {
  const pxPositions = positions.map(getTilePosition)
  return {
    x: utils.average(pxPositions.map((pos) => pos.x)),
    y: utils.average(pxPositions.map((pos) => pos.y)),
  }
}
