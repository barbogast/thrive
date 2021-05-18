import React from 'react'
import { useController } from '../hooks/useConnection'

import * as routing from '../routing'
import { useStore, ActionType } from '../state'
import Box from './Box'

function Controls() {
  const gameId = routing.useGameId()
  const store = useStore((state) => ({
    nextTurn: state.nextTurn,
    currentPlayer: state.games[gameId].currentPlayer,
    toggleCurrentAction: state.toggleCurrentAction,
    currentAction: state.uiState.currentAction,
    currentDiceRoll: state.games[gameId].currentDiceRoll,
  }))
  const controller = useController()

  return (
    <div>
      Current player: <Box color={store.currentPlayer} />
      <br />
      Current dice roll:{' '}
      {store.currentDiceRoll.length ? store.currentDiceRoll.join(' | ') : ''}
      <br />
      <button
        onClick={() => store.toggleCurrentAction(gameId, ActionType.buildRoad)}
        style={{
          boxShadow:
            store.currentAction.type === ActionType.buildRoad
              ? '0 0 0 2px black'
              : '',
        }}
      >
        Build road
      </button>
      &nbsp;&nbsp;
      <button
        onClick={() => store.toggleCurrentAction(gameId, ActionType.buildTown)}
        style={{
          boxShadow:
            store.currentAction.type === ActionType.buildTown
              ? '0 0 0 2px black'
              : '',
        }}
      >
        Build town
      </button>
      &nbsp;&nbsp;
      <button onClick={() => store.nextTurn(gameId, controller.sendState)}>
        Finish turn
      </button>
    </div>
  )
}

export default Controls
