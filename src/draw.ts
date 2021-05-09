import Konva from 'konva'

import config from './config'
import * as hexUtils from './hexUtils'
import { Tile } from './types'

function getCoordinates(row: number, col: number) {
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

export function drawTile(layer: Konva.Layer, info: Tile) {
  const {
    position: { row, col },
    color,
  } = info

  const axial = hexUtils.offsetToAxial(info.position)
  drawHexagon(
    layer,
    getCoordinates(row, col),
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

  const rect = new Konva.Rect({
    offsetX: config().tileRadius / 2,
    offsetY: config().tileRadius - 2,
    width: config().tileRadius,
    height: 10,
    rotate: 30,
    // fill: '#00D2FF',
    id: 'haha',
    stroke: 'black',
    strokeWidth: 0,
  })

  rect.on('mouseover', function (evt) {
    var shape = evt.target
    document.body.style.cursor = 'pointer'
    shape.scaleX(1.2)
    shape.scaleY(1.2)
    shape.setAttr('fill', 'red')
    layer.draw()
  })

  rect.on('mouseout', function (evt) {
    var shape = evt.target
    document.body.style.cursor = 'default'
    shape.scaleX(1)
    shape.scaleY(1)
    layer.draw()
  })

  group.add(rect)

  const rect2 = new Konva.Rect({
    offsetX: config().tileRadius / 2,
    offsetY: config().tileRadius + 6,
    width: config().tileRadius,
    height: 15,
    rotate: 30,
    fill: 'brown',
    id: 'haha',
    stroke: 'black',
    strokeWidth: 1,
  })
  group.add(rect2)

  layer.add(group)
}
