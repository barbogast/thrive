import Konva from 'konva'

import config from './config'
import * as hexUtils from './hexUtils'
import * as board from './board'
import * as game from './game'

function getCoordinates(position: hexUtils.OffsetPosition) {
  const { row, col } = position
  const left = 250
  const top = 250

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

export function drawTile(layer: Konva.Layer, info: game.Tile) {
  const { position, color } = info

  const axial = hexUtils.offsetToAxial(info.position)
  drawHexagon(
    layer,
    getCoordinates(position),
    color,
    `r: ${axial.q}\nc: ${axial.r}`,
  )
}

function drawHexagon(
  layer: Konva.Layer,
  pos: hexUtils.PixelPosition,
  color: string,
  label: string,
) {
  var group = new Konva.Group({
    x: pos.x,
    y: pos.y,
  })

  group.add(
    new Konva.RegularPolygon({
      sides: 6,
      rotation: config().flatTopped ? 30 : 0,
      radius: config().tileRadius + 1,
      fill: color,
      stroke: 'black',
      strokeWidth: 1,
      id: 'asdf' + pos.x + pos.y,
    }),
  )
  group.add(
    new Konva.Text({
      text: label,
      fontSize: 10,
      fontFamily: 'Arial',
    }),
  )

  layer.add(group)
}

function average(numbers: number[]) {
  const sum = numbers.reduce((a, b) => a + b, 0)
  return sum / numbers.length || 0
}

function getMiddle(
  positions: hexUtils.OffsetPosition[],
): hexUtils.PixelPosition {
  const pxPositions = positions.map(getCoordinates)
  return {
    x: average(pxPositions.map((pos) => pos.x)),
    y: average(pxPositions.map((pos) => pos.y)),
  }
}

export function drawRoad(layer: Konva.Layer, road: board.Road) {
  const [tile1, tile2] = road.tiles

  const direction = hexUtils.getDirection(
    hexUtils.offsetToAxial(tile1),
    hexUtils.offsetToAxial(tile2),
  )

  const directionToDegree = {
    0: 90,
    1: 150,
    2: 210,
    3: 270,
    4: 330,
    5: 30,
  }

  const middle = getMiddle(road.tiles)
  const rect = new Konva.Rect({
    x: middle.x,
    y: middle.y,
    offsetX: config().tileRadius / 2,
    offsetY: 3,
    width: config().tileRadius,
    height: 7,
    rotation: directionToDegree[direction],
    // fill: '#00D2FF',
    id: 'haha',
    stroke: 'black',
    strokeWidth: 1,
  })
  layer.add(rect)
}

export function drawTown(layer: Konva.Layer, town: board.Town) {
  const middle = getMiddle(town.tiles)
  const rect = new Konva.Circle({
    x: middle.x,
    y: middle.y,
    radius: 10,
    fill: 'black',
    id: 'haha',
    stroke: 'black',
    strokeWidth: 1,
  })
  layer.add(rect)
}
