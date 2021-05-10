import create, { SetState } from 'zustand'
import produce from 'immer'

import * as game from '../game'

type Setter = {
  initialise: () => void
  buildTown: (id: string) => void
}

const useStore = create<game.GameState & Setter>((set) => {
  const iSet = (fn: (state: game.GameState) => void) => set(produce(fn))
  return {
    tiles: {},
    roads: [],
    towns: [],
    players: [],
    currentPlayer: game.PlayerId.green,

    initialise: () => iSet(() => game.initialiseGame()),

    buildTown: (id: string) =>
      iSet((draft) => {
        const town = draft.towns.find((town) => town.id === id)!
        town.owner = game.PlayerId.green
      }),
  }
})

export default useStore
