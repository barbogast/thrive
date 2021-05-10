import Konva from 'konva'
import * as draw from './draw'
import * as tileMap from './tileMap'
import * as board from './board'
import * as game from './game'

var stage = new Konva.Stage({
  container: 'container', // id of container <div>
  width: 500,
  height: 500,
  draggable: true,
})

var layer = new Konva.Layer()

function init() {
  const state = game.initialiseGame()
  for (const tile of Object.values(state.tiles)) {
    draw.drawTile(layer, tile)
  }

  for (const road of state.roads) {
    draw.drawRoad(layer, road)
  }

  for (const town of state.towns) {
    draw.drawTown(layer, town)
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
