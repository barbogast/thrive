import React from 'react'
import styled, { css } from 'styled-components'

import * as routing from '../lib/routing'
import * as game from '../lib/game'
import * as setters from '../state/setters'
import { useLocalStore } from '../state/localState'
import { useCurrentGame } from '../state/gameState'
import { UiActionType, useTempStore } from '../state/tempState'

const SelectableButton = styled.button<{ selected: boolean }>`
  ${(props) =>
    props.selected &&
    css`
      box-shadow: 0 0 0 2px black;
    `}
`

const Controls: React.FC = function Controls() {
  const gameId = routing.useGameId()
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
  }))
  const gameStore = useCurrentGame((game) => ({
    currentAction: game.sequence.scheduledActions[0],
    players: game.players,
  }))
  const tempStore = useTempStore((state) => ({
    currentAction: state.currentAction,
  }))
  const allowedActions = game.getAllowedUiActions(gameStore.currentAction)

  const player = gameStore.players[gameStore.currentAction.playerId]
  if (player.peerId !== localStore.myId) {
    return <>Waiting for {player.name}</>
  }

  return (
    <div>
      {allowedActions.includes(UiActionType.buildRoad) ? (
        <SelectableButton
          onClick={() => setters.toggleCurrentAction(UiActionType.buildRoad)}
          selected={tempStore.currentAction.type === UiActionType.buildRoad}
        >
          Build road
        </SelectableButton>
      ) : (
        <></>
      )}
      &nbsp;&nbsp;
      {allowedActions.includes(UiActionType.buildTown) ? (
        <SelectableButton
          onClick={() => setters.toggleCurrentAction(UiActionType.buildTown)}
          selected={tempStore.currentAction.type === UiActionType.buildTown}
        >
          Build town
        </SelectableButton>
      ) : (
        <></>
      )}
      &nbsp;&nbsp;
      {allowedActions.includes(UiActionType.endTurn) ? (
        <button onClick={() => setters.nextTurn(gameId)}>Finish turn</button>
      ) : (
        <></>
      )}
      &nbsp;&nbsp;
      {allowedActions.includes(UiActionType.rollDice) ? (
        <button onClick={() => setters.rollDice(gameId)}>Roll dice</button>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Controls
