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

function init() {
  for (const tile of getHexagonBoard('5')) {
    drawAtCoordinate(tile)
  }

  stage.add(layer)

  layer.draw()
  layer.on('click', (...args) => {
    console.log('lick', args)
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
