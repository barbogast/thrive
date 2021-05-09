import Konva from 'konva'

type PixelPosition = {
  x: number
  y: number
}

type OffsetPosition = {
  row: number
  col: number
}

type AxialPosition = {
  q: number
  r: number
}

type Tile = {
  position: OffsetPosition
  color: string
}

function offsetToAxial({ row, col }: OffsetPosition): AxialPosition {
  return { q: row, r: col - (row - (row & 1)) / 2 }
}

function axialToOffset({ q, r }: AxialPosition): OffsetPosition {
  return { row: q, col: r + (q - (q & 1)) / 2 }
}

var stage = new Konva.Stage({
  container: 'container', // id of container <div>
  width: 500,
  height: 500,
  draggable: true,
})

var layer = new Konva.Layer()

const r = 30

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
    position: axialToOffset(p),
    color: getColor(),
  }))
}

function init() {
  for (const tile of getHexagonBoard('3')) {
    drawAtCoordinate(tile)
  }

  stage.add(layer)

  layer.draw()
  layer.on('click', (...args) => {
    console.log('lick', args)
  })
}

init()

function drawAtCoordinate(info: Tile) {
  const {
    position: { row, col },
    color,
  } = info
  const distance = 0

  const left = 50
  const top = 50
  const height = Math.sqrt(3) * r
  const isOffset = row % 2 !== 0 ? (r * 2) / 2 : 0

  const axial = offsetToAxial(info.position)
  drawHexagon(
    { x: left + row * height, y: top + col * (r * 2 + distance) + isOffset },
    color,
    `r: ${axial.q}\nc: ${axial.r}`,
  )
}

function drawHexagon(pos: PixelPosition, color: string, label: string) {
  var group = new Konva.Group({
    x: pos.x,
    y: pos.y,
  })

  group.add(
    new Konva.RegularPolygon({
      sides: 6,
      rotation: 30,
      radius: r + 1,
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
