import React from 'react'

import * as routing from '../routing'
import { useStore, ActionType } from '../state'
import Box from './Box'

function Controls() {
  const gameId = routing.useGameId()
  const {
    nextTurn,
    currentPlayer,
    toggleCurrentAction,
    currentAction,
    currentDiceRoll,
  } = useStore((state) => ({
    nextTurn: state.nextTurn,
    currentPlayer: state.games[gameId].currentPlayer,
    toggleCurrentAction: state.toggleCurrentAction,
    currentAction: state.uiState.currentAction,
    currentDiceRoll: state.games[gameId].currentDiceRoll,
  }))

  return (
    <div>
      Current player: <Box color={currentPlayer} />
      <br />
      Current dice roll:{' '}
      {currentDiceRoll.length ? currentDiceRoll.join(' | ') : ''}
      <br />
      <button
        onClick={() => toggleCurrentAction(gameId, ActionType.buildRoad)}
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
        onClick={() => toggleCurrentAction(gameId, ActionType.buildTown)}
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
      <button onClick={() => nextTurn(gameId)}>Finish turn</button>
    </div>
  )
}

export default Controls
