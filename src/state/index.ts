import create from 'zustand'
import produce from 'immer'

import * as game from '../game'

type State = {
  gameState: game.GameState
}

type Setter = {
  initialise: () => void
  buildTown: (id: string) => void
  nextPlayer: () => void
}

const useStore = create<State & Setter>((set) => {
  const iSet = (fn: (state: State) => void) => set(produce(fn))
  return {
    gameState: {
      tiles: {},
      roads: [],
      towns: [],
      players: [],
      currentPlayer: game.PlayerId.green,
    },

    initialise: () => iSet(() => ({ gameState: game.initialiseGame() })),

    buildTown: (id: string) =>
      iSet((draft) => {
        const town = draft.gameState.towns.find((town) => town.id === id)!
        town.owner = draft.gameState.currentPlayer
      }),

    nextPlayer: () =>
      iSet((draft) => {
        draft.gameState.currentPlayer = game.getNextPlayer(
          draft.gameState.currentPlayer,
        )
      }),
  }
})

export default useStore
