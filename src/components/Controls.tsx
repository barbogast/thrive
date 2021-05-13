import React from 'react'

import useStore, { ActionType } from '../state'
import Box from './Box'

function Controls() {
  const {
    nextTurn,
    currentPlayer,
    toggleCurrentAction,
    currentAction,
    currentDiceRoll,
  } = useStore((state) => ({
    nextTurn: state.nextTurn,
    currentPlayer: state.gameState.currentPlayer,
    toggleCurrentAction: state.toggleCurrentAction,
    currentAction: state.uiState.currentAction,
    currentDiceRoll: state.gameState.currentDiceRoll,
  }))

  return (
    <div>
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
    </div>
  )
}

export default Controls
