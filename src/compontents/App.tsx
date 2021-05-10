import { KonvaEventObject } from 'konva-types/Node'
import { Stage as StateType } from 'konva-types/Stage'
import React, { useState } from 'react'
import { Stage, useStrictMode } from 'react-konva'

import * as game from '../game'
import Board from './Board'

useStrictMode(true)

function onWheel(e: KonvaEventObject<WheelEvent>) {
  const scaleBy = 1.05

  const stage = e.currentTarget as StateType

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
}

function useGameState() {
  const [state, setState] = useState<game.GameState>(game.initialiseGame())
  const buildTown = (id: string) =>
    setState((state) => game.buildTown(state, id))
  return { state, buildTown }
}

function App(): JSX.Element {
  const { state, buildTown } = useGameState()

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={onWheel}
      draggable
    >
      <Board gameState={state} onTownClick={buildTown} />
    </Stage>
  )
}

export default App
