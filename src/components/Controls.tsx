import React from 'react'

import * as routing from '../routing'
import * as game from '../game'
import * as setters from '../state/setters'
import { useStore, UiActionType, useStores } from '../state'

const Controls: React.FC = function Controls() {
  const gameId = routing.useGameId()
  const store = useStore((state) => ({
    myId: state.myId,
    currentAction: state.games[gameId].sequence.scheduledActions[0],
    currentDiceRoll: state.games[gameId].currentDiceRoll,
    players: state.games[gameId].players,
  }))
  const stores = useStores()
  const allowedActions = game.getAllowedUiActions(store.currentAction)

  const player = store.players[store.currentAction.playerId]
  if (player.peerId !== store.myId) {
    return <>Waiting for {player.name}</>
  }

  return (
    <div>
      {store.currentAction.type !== game.GameActionType.rollDice
        ? 'Current dice roll: ' + store.currentDiceRoll.join(' | ')
        : ''}
      <br />
      {allowedActions.includes(UiActionType.buildRoad) ? (
        <button
          onClick={() =>
            setters.toggleCurrentAction(stores)(UiActionType.buildRoad)
          }
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
          onClick={() =>
            setters.toggleCurrentAction(stores)(UiActionType.buildTown)
          }
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
        <button onClick={() => setters.nextTurn(stores)(gameId)}>
          Finish turn
        </button>
      ) : (
        <></>
      )}
      &nbsp;&nbsp;
      {allowedActions.includes(UiActionType.rollDice) ? (
        <button onClick={() => setters.rollDice(stores)(gameId)}>
          Roll dice
        </button>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Controls
