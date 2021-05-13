import create from 'zustand'
import produce from 'immer'

import * as game from '../game'

export enum ActionType {
  buildRoad = 'buildRoad',
  buildTown = 'buildTown',
  none = 'none',
}

type State = {
  gameState: game.GameState
  uiState: {
    currentAction: ActionType
  }
}

type Setter = {
  initialise: () => void
  buildTown: (id: string) => void
  buildRoad: (id: string) => void
  nextTurn: () => void
  toggleCurrentAction: (action: ActionType) => void
}

const useStore = create<State & Setter>((set) => {
  const iSet = (fn: (state: State) => void) => set(produce(fn))
  return {
    gameState: {
      tiles: {},
      roads: [],
      towns: [],
      players: game.initialisePlayers(),
      currentPlayer: game.PlayerId.green,
      currentDiceRoll: [],
    },
    uiState: {
      currentAction: ActionType.none,
    },

    initialise: () => iSet(() => ({ gameState: game.initialiseGame() })),

    buildTown: (id: string) =>
      iSet((draft) => {
        game.buildTown(draft.gameState, id)
        draft.uiState.currentAction = ActionType.none
      }),

    buildRoad: (id: string) =>
      iSet((draft) => {
        game.buildRoad(draft.gameState, id)
        draft.uiState.currentAction = ActionType.none
      }),

    nextTurn: () =>
      iSet((draft) => {
        game.rollDice(draft.gameState)
        draft.gameState.currentPlayer = game.getNextPlayer(
          draft.gameState.currentPlayer,
        )
      }),

    toggleCurrentAction: (action: ActionType) =>
      iSet((draft) => {
        draft.uiState.currentAction =
          action === draft.uiState.currentAction ? ActionType.none : action
      }),
  }
})

export default useStore
