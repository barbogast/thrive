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

var stage = new Konva.Stage({
  container: 'container', // id of container <div>
  width: 500,
  height: 500,
  draggable: true,
})

var layer = new Konva.Layer()

const a = (2 * Math.PI) / 6
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

function regularPolygonPoints(sideCount: number, radius: number) {
  var sweep = (Math.PI * 2) / sideCount
  var cx = radius
  var cy = radius
  var points = []
  for (var i = 0; i < sideCount; i++) {
    var x = cx + radius * Math.cos(i * sweep)
    var y = cy + radius * Math.sin(i * sweep)
    points.push({ x: x, y: y })
  }
  return points
}
const hexagonPoints = regularPolygonPoints(6, r)

function getSquareBoard(): Tile[] {
  const tiles = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tiles.push({ position: { row: x, col: y }, color: getColor() })
    }
  }
  return tiles
}

function getHexagonBoard(): Tile[] {
  // return [
  //   { y: 0, x: 1, color: getColor() }
  // ];

  const rows = [1, 3, 1]
  const tiles = []

  let i = 0
  for (const rowLength of rows) {
    for (let x = 0; x < rowLength; x++) {
      tiles.push({ position: { row: x, col: i }, color: getColor() })
      console.log(x, i)
    }
    i++
  }
  return tiles
}

function init() {
  for (const tile of getHexagonBoard()) {
    drawAtCoordinate(tile)
  }

  stage.add(layer)

  // draw the image
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
