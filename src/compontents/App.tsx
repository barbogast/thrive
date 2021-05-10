import { KonvaEventObject } from 'konva-types/Node'
import { Stage as StateType } from 'konva-types/Stage'
import React, { useEffect, useState } from 'react'
import { Stage, useStrictMode } from 'react-konva'

import * as game from '../game'
import useStore from '../state'
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

function App(): JSX.Element {
  const { initialise, nextPlayer, currentPlayer } = useStore((state) => ({
    initialise: state.initialise,
    nextPlayer: state.nextPlayer,
    currentPlayer: state.gameState.currentPlayer,
  }))
  useEffect(initialise, [])

  return (
    <>
      Current player:{' '}
      <span
        style={{
          backgroundColor: currentPlayer,
          width: 10,
          height: 10,
          display: 'inline-block',
        }}
      ></span>
      <br></br>
      <button onClick={nextPlayer}>Next player</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={onWheel}
        draggable
      >
        <Board />
      </Stage>
    </>
  )
}

export default App
