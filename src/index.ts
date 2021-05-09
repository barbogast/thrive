import Konva from 'konva'
import config from './config'
import * as hexUtils from './hexUtils'

type Tile = {
  position: hexUtils.OffsetPosition
  color: string
}

var stage = new Konva.Stage({
  container: 'container', // id of container <div>
  width: 500,
  height: 500,
  draggable: true,
})

var layer = new Konva.Layer()

const TILE_RADIUS = 50

function getColor() {
  const colors = [
    'lightyellow',
    'yellow',
    'darkgreen',
    'lightgreen',
    'grey',
    'brown',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function getSquareBoard(): Tile[] {
  const tiles = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tiles.push({ position: { row: x, col: y }, color: getColor() })
    }
  }
  return tiles
}

function getHexagonBoard(size: '3' | '5'): Tile[] {
  const positions = {
    '3': [
      { q: -1, r: 0 },
      { q: -1, r: 1 },

      { q: 0, r: -1 },
      { q: 0, r: 0 },
      { q: 0, r: 1 },

      { q: 1, r: -1 },
      { q: 1, r: 0 },
    ],
    '5': [
      { q: -2, r: 0 },
      { q: -2, r: 1 },
      { q: -2, r: 2 },

      { q: -1, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: -1, r: 2 },

      { q: 0, r: -2 },
      { q: 0, r: -1 },
      { q: 0, r: 0 },
      { q: 0, r: 1 },
      { q: 0, r: 2 },

      { q: 1, r: -2 },
      { q: 1, r: -1 },
      { q: 1, r: 0 },
      { q: 1, r: 1 },

      { q: 2, r: -2 },
      { q: 2, r: -1 },
      { q: 2, r: 0 },
    ],
  }

  return positions[size].map((p) => ({
    position: hexUtils.axialToOffset(p),
    color: getColor(),
  }))
}

function init() {
  for (const tile of getHexagonBoard('5')) {
    drawAtCoordinate(tile)
  }

  layer.add(
    new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    }),
  )

  stage.add(layer)

  layer.draw()
  layer.on('click', (event) => {
    console.log(event)

    console.log('lick', event.evt.offsetX, event.evt.offsetY)
  })
}

init()

function getCoordinates(row: number, col: number) {
  const left = 250
  const top = 250
  const distance = 0
  const r = config().tileRadius
  if (config().flatTopped) {
    const height = Math.sqrt(3) * r
    const isOffset = row % 2 !== 0 ? (r * 2) / 2 : 0
    return {
      x: left + row * height,
      y: top + col * (r * 2 + distance) + isOffset,
    }
  } else {
    const height = Math.sqrt(3) * r
    const isOffset = col % 2 !== 0 ? (r * 2) / 2 : 0
    return {
      x: left + row * (r * 2 + distance) + isOffset,
      y: top + left + col * height,
    }
  }
}

function drawAtCoordinate(info: Tile) {
  const {
    position: { row, col },
    color,
  } = info

  const axial = hexUtils.offsetToAxial(info.position)
  drawHexagon(getCoordinates(row, col), color, `r: ${axial.q}\nc: ${axial.r}`)
}

function drawHexagon(
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
    offsetX: TILE_RADIUS / 2,
    offsetY: TILE_RADIUS - 2,
    width: TILE_RADIUS,
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
    offsetX: TILE_RADIUS / 2,
    offsetY: TILE_RADIUS + 6,
    width: TILE_RADIUS,
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

var scaleBy = 1.05
stage.on('wheel', (e) => {
  e.evt.preventDefault()
  var oldScale = stage.scaleX()

  var pointer = stage.getPointerPosition()

  if (!pointer) {
    return
  }
  var mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy

  stage.scale({ x: newScale, y: newScale })

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }
  stage.position(newPos)
  stage.batchDraw()
})
