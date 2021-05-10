import Konva from 'konva'

import config from './config'
import * as hexUtils from './hexUtils'
import * as board from './board'

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

export function drawTile(layer: Konva.Layer, info: board.Tile) {
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

function getMiddle(pos1: number, pos2: number) {
  const distance = Math.abs(pos1 - pos2)
  return pos1 > pos2 ? pos2 + distance / 2 : pos1 + distance / 2
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

  const pos1 = getCoordinates(tile1)
  const pos2 = getCoordinates(tile2)

  const midX = getMiddle(pos1.x, pos2.x)
  const midY = getMiddle(pos1.y, pos2.y)

  const rect = new Konva.Rect({
    x: midX,
    y: midY,
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
  const t1 = getCoordinates(town.tiles[0])
  const t2 = getCoordinates(town.tiles[1])
  const t3 = getCoordinates(town.tiles[2])
  const x = (t1.x + t2.x + t3.x) / 3
  const y = (t1.y + t2.y + t3.y) / 3

  const rect = new Konva.Circle({
    x,
    y,
    radius: 10,
    fill: 'black',
    id: 'haha',
    stroke: 'black',
    strokeWidth: 1,
  })
  layer.add(rect)
}
