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

type CubePosition = {
  x: number
  y: number
  z: number
}

type Tile = {
  position: OffsetPosition
  color: string
}

const FLAT_TOPPED = true

function offsetToAxial({ row, col }: OffsetPosition): AxialPosition {
  if (FLAT_TOPPED) {
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

function axialToOffset({ q, r }: AxialPosition): OffsetPosition {
  if (FLAT_TOPPED) {
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

function cubeToAxial(cube: CubePosition): AxialPosition {
  var q = cube.x
  var r = cube.z
  return { q, r }
}

function axialToCube(pos: AxialPosition): CubePosition {
  var x = pos.q
  var z = pos.r
  var y = -x - z
  return { x, y, z }
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
    position: axialToOffset(p),
    color: getColor(),
  }))
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
  var q = ((2 / 3) * point.x) / TILE_RADIUS
  var r = ((-1 / 3) * point.x + (Math.sqrt(3) / 3) * point.y) / TILE_RADIUS
  return hexRound({ q, r })
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
  if (FLAT_TOPPED) {
    const height = Math.sqrt(3) * TILE_RADIUS
    const isOffset = row % 2 !== 0 ? (TILE_RADIUS * 2) / 2 : 0
    return {
      x: left + row * height,
      y: top + col * (TILE_RADIUS * 2 + distance) + isOffset,
    }
  } else {
    const height = Math.sqrt(3) * TILE_RADIUS
    const isOffset = col % 2 !== 0 ? (TILE_RADIUS * 2) / 2 : 0
    return {
      x: left + row * (TILE_RADIUS * 2 + distance) + isOffset,
      y: top + left + col * height,
    }
  }
}

function drawAtCoordinate(info: Tile) {
  const {
    position: { row, col },
    color,
  } = info

  const axial = offsetToAxial(info.position)
  drawHexagon(getCoordinates(row, col), color, `r: ${axial.q}\nc: ${axial.r}`)
}

function drawHexagon(pos: PixelPosition, color: string, label: string) {
  var group = new Konva.Group({
    x: pos.x,
    y: pos.y,
  })

  group.add(
    new Konva.RegularPolygon({
      sides: 6,
      rotation: FLAT_TOPPED ? 30 : 0,
      radius: TILE_RADIUS + 1,
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
