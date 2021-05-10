import { KonvaEventObject } from 'konva-types/Node'
import { Stage as StateType } from 'konva-types/Stage'
import React, { useEffect, useState } from 'react'
import { Stage, useStrictMode } from 'react-konva'

import * as game from '../game'
import useStore, { Action } from '../state'
import Board from './Board'
import { getColorForTileType } from './HexTile'

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

function Box({ color }: { color: string }): JSX.Element {
  return (
    <span
      style={{
        backgroundColor: color,
        width: 10,
        height: 10,
        display: 'inline-block',
      }}
    ></span>
  )
}

function App(): JSX.Element {
  const {
    initialise,
    nextPlayer,
    currentPlayer,
    toggleCurrentAction,
    currentAction,
    players,
    state,
  } = useStore((state) => ({
    initialise: state.initialise,
    nextPlayer: state.nextPlayer,
    currentPlayer: state.gameState.currentPlayer,
    toggleCurrentAction: state.toggleCurrentAction,
    currentAction: state.uiState.currentAction,
    players: state.gameState.players,
    state: state,
  }))
  useEffect(initialise, [])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {players.map((player) => {
          return (
            <div>
              {player.id}
              <ul>
                <li>
                  <Box color={getColorForTileType(game.Resource.wood)} />
                  &nbsp; Wood: {player.resources.wood}
                </li>
                <li>
                  <Box color={getColorForTileType(game.Resource.brick)} />
                  &nbsp; Brick: {player.resources.brick}
                </li>
                <li>
                  <Box color={getColorForTileType(game.Resource.grain)} />
                  &nbsp; Grain: {player.resources.grain}
                </li>
                <li>
                  <Box color={getColorForTileType(game.Resource.sheep)} />
                  &nbsp; Sheep: {player.resources.sheep}
                </li>
                <li>
                  <Box color={getColorForTileType(game.Resource.wood)} /> &nbsp;
                  Ore: {player.resources.ore}
                </li>
              </ul>
            </div>
          )
        })}
      </div>
      Current player: <Box color={currentPlayer} />
      <br />
      <button onClick={nextPlayer}>Next player</button>
      &nbsp;&nbsp;
      <button
        onClick={() => toggleCurrentAction(Action.buildRoad)}
        style={{
          boxShadow:
            currentAction === Action.buildRoad ? '0 0 0 2px black' : '',
        }}
      >
        Build road
      </button>
      &nbsp;&nbsp;
      <button
        onClick={() => toggleCurrentAction(Action.buildTown)}
        style={{
          boxShadow:
            currentAction === Action.buildTown ? '0 0 0 2px black' : '',
        }}
      >
        Build town
      </button>
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
    </>
  )
}

export default App
