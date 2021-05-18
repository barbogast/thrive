import React from 'react'
import { GameState } from '../game'

import * as routing from '../routing'
import { useStore, ActionType } from '../state'
import Box from './Box'

type Props = {
  sendState: (gameId: string, newState: GameState) => void
}

function Controls({ sendState }: Props) {
  const gameId = routing.useGameId()
  const store = useStore((state) => ({
    nextTurn: state.nextTurn,
    currentPlayer: state.games[gameId].currentPlayer,
    toggleCurrentAction: state.toggleCurrentAction,
    currentAction: state.uiState.currentAction,
    currentDiceRoll: state.games[gameId].currentDiceRoll,
  }))

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
      <button onClick={() => store.nextTurn(gameId, sendState)}>
        Finish turn
      </button>
    </div>
  )
}

export default Controls
