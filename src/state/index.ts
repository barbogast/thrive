import create from 'zustand'
import produce from 'immer'

import * as game from '../game'

export enum Action {
  buildRoad = 'buildRoad',
  buildTown = 'buildTown',
  none = 'none',
}

type State = {
  gameState: game.GameState
  uiState: {
    currentAction: Action
  }
}

type Setter = {
  initialise: () => void
  buildTown: (id: string) => void
  buildRoad: (id: string) => void
  nextTurn: () => void
  toggleCurrentAction: (action: Action) => void
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
      currentAction: Action.none,
    },

    initialise: () => iSet(() => ({ gameState: game.initialiseGame() })),

    buildTown: (id: string) =>
      iSet((draft) => {
        const town = draft.gameState.towns.find((town) => town.id === id)!
        town.owner = draft.gameState.currentPlayer
      }),

    buildRoad: (id: string) =>
      iSet((draft) => {
        const road = draft.gameState.roads.find((road) => road.id === id)!
        road.owner = draft.gameState.currentPlayer
      }),

    nextTurn: () =>
      iSet((draft) => {
        game.rollDice(draft.gameState)
        draft.gameState.currentPlayer = game.getNextPlayer(
          draft.gameState.currentPlayer,
        )
      }),

    toggleCurrentAction: (action: Action) =>
      iSet((draft) => {
        draft.uiState.currentAction =
          action === draft.uiState.currentAction ? Action.none : action
      }),
  }
})

export default useStore
