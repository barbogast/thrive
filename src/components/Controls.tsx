import React from 'react'

import * as routing from '../routing'
import * as game from '../game'
import * as setters from '../state/setters'
import { useStores } from '../state/useStores'
import { useLocalStore } from '../state/localState'
import { useGameStore } from '../state/gameState'
import { UiActionType } from '../state/tempState'

const Controls: React.FC = function Controls() {
  const gameId = routing.useGameId()
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
  }))
  const gameStore = useGameStore((state) => ({
    currentAction: state.games[gameId].sequence.scheduledActions[0],
    players: state.games[gameId].players,
  }))
  const stores = useStores()
  const allowedActions = game.getAllowedUiActions(gameStore.currentAction)

  const player = gameStore.players[gameStore.currentAction.playerId]
  if (player.peerId !== localStore.myId) {
    return <>Waiting for {player.name}</>
  }

  return (
    <div>
      {allowedActions.includes(UiActionType.buildRoad) ? (
        <button
          onClick={() =>
            setters.toggleCurrentAction(stores)(UiActionType.buildRoad)
          }
          style={{
            boxShadow:
              gameStore.currentAction.type === UiActionType.buildRoad
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
              gameStore.currentAction.type === UiActionType.buildTown
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
