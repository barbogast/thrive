import Konva from 'konva'
import * as draw from './draw'
import * as hexUtils from './hexUtils'
import * as tileMap from './tileMap'
import { Tile } from './types'

type Road = {
  tiles:
    | [hexUtils.OffsetPosition]
    | [hexUtils.OffsetPosition, hexUtils.OffsetPosition]
}

var stage = new Konva.Stage({
  container: 'container', // id of container <div>
  width: 500,
  height: 500,
  draggable: true,
})

var layer = new Konva.Layer()

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

function getRoadPositions(tiles: tileMap.TileMap): Road[] {
  /*
  For every tile we add roads in directions 1, 2 and 3
  For the ones which lack neighours 4, 5 or 6 we add those as well.
  This should give us each road position exactly once */
  const roads: Road[] = []
  for (const tile of Object.values(tiles)) {
    const axialPos = hexUtils.offsetToAxial(tile.position)

    for (const direction of [0, 1, 2] as hexUtils.Direction[]) {
      const neighborPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
      const road: Road = {
        tiles: [tile.position, neighborPos],
      }
      roads.push(road)
    }
    for (const direction of [3, 4, 5] as hexUtils.Direction[]) {
      const neighbourPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
      if (!tileMap.findInPos(tiles, neighbourPos)) {
        const road: Road = {
          tiles: [tile.position, neighbourPos],
        }
        roads.push(road)
      }
    }
  }
  return roads
}

function init() {
  const tiles = getHexagonBoard('3')

  const tMap = tileMap.fromArray(tiles)

  const roads = getRoadPositions(tMap)
  console.log(roads)

  for (const tile of tiles) {
    draw.drawTile(layer, tile)
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
