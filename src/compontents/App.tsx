import { KonvaEventObject } from 'konva-types/Node'
import { Stage as StateType } from 'konva-types/Stage'
import React, { useEffect } from 'react'
import { Stage, useStrictMode } from 'react-konva'
import useConnection from '../useConnection'

import useStore, { ActionType } from '../state'
import Board from './Board'
import Box from './Box'

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
  const {
    initialise,
    nextTurn,
    currentPlayer,
    toggleCurrentAction,
    currentAction,
    currentDiceRoll,
    players,
    state,
  } = useStore((state) => ({
    initialise: state.initialise,
    nextTurn: state.nextTurn,
    currentPlayer: state.gameState.currentPlayer,
    toggleCurrentAction: state.toggleCurrentAction,
    currentAction: state.uiState.currentAction,
    currentDiceRoll: state.gameState.currentDiceRoll,
    players: state.gameState.players,
    state: state,
  }))
  useEffect(initialise, [])

  const connect = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const gameId = urlParams.get('gameid')
    if (!gameId) {
      return
    }
    connectToPeer(gameId)
  }
  const { peerId, connectToPeer, sendState } = useConnection()
  const peerLink = window.location.host + '?gameid=' + peerId

  return (
    <>
      {peerId && <a href={peerLink}>{peerLink}</a>}
      <button onClick={connect}>Connect</button>
      Current player: <Box color={currentPlayer} />
      <br />
      Current dice roll:{' '}
      {currentDiceRoll.length ? currentDiceRoll.join(' | ') : ''}
      <br />
      <button
        onClick={() => toggleCurrentAction(ActionType.buildRoad)}
        style={{
          boxShadow:
            currentAction.type === ActionType.buildRoad
              ? '0 0 0 2px black'
              : '',
        }}
      >
        Build road
      </button>
      &nbsp;&nbsp;
      <button
        onClick={() => toggleCurrentAction(ActionType.buildTown)}
        style={{
          boxShadow:
            currentAction.type === ActionType.buildTown
              ? '0 0 0 2px black'
              : '',
        }}
      >
        Build town
      </button>
      &nbsp;&nbsp;
      <button onClick={nextTurn}>Finish turn</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={onWheel}
        draggable
      >
        <Board />
      </Stage>
      &nbsp;&nbsp;
      <button onClick={() => console.log(state)}>Log state</button>
      <button onClick={() => sendState()}>Send state</button>
    </>
  )
}

export default App
