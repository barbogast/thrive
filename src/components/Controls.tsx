import React from 'react'
import { useSendState } from '../hooks/useConnection'

import * as routing from '../routing'
import * as game from '../game'
import { useStore, UiActionType } from '../state'

const Controls: React.FC = function Controls() {
  const gameId = routing.useGameId()
  const store = useStore((state) => ({
    nextTurn: state.nextTurn,
    toggleCurrentAction: state.toggleCurrentAction,
    currentAction: state.games[gameId].sequence.scheduledActions[0],
    currentDiceRoll: state.games[gameId].currentDiceRoll,
    rollDice: state.rollDice,
  }))
  const sendState = useSendState()
  const allowedActions = game.getAllowedUiActions(store.currentAction)

  return (
    <div>
      {store.currentAction.type !== game.GameActionType.rollDice
        ? 'Current dice roll: ' + store.currentDiceRoll.join(' | ')
        : ''}
      <br />
      {allowedActions.includes(UiActionType.buildRoad) ? (
        <button
          onClick={() => store.toggleCurrentAction(UiActionType.buildRoad)}
          style={{
            boxShadow:
              store.currentAction.type === UiActionType.buildRoad
                ? '0 0 0 2px black'
                : '',
          }}
        >
          Build road
        </button>
      ) : (
        <></>
      )}
      &nbsp;&nbsp;
      {allowedActions.includes(UiActionType.buildTown) ? (
        <button
          onClick={() => store.toggleCurrentAction(UiActionType.buildTown)}
          style={{
            boxShadow:
              store.currentAction.type === UiActionType.buildTown
                ? '0 0 0 2px black'
                : '',
          }}
        >
          Build town
        </button>
      ) : (
        <></>
      )}
      &nbsp;&nbsp;
      {allowedActions.includes(UiActionType.endTurn) ? (
        <button onClick={() => store.nextTurn(gameId, sendState)}>
          Finish turn
        </button>
      ) : (
        <></>
      )}
      &nbsp;&nbsp;
      {allowedActions.includes(UiActionType.rollDice) ? (
        <button onClick={() => store.rollDice(gameId)}>Roll dice</button>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Controls
