import create from 'zustand'

import * as game from '../game'

type Setter = {
  initialise: () => void
  buildTown: (id: string) => void
}

const useStore = create<game.GameState & Setter>((set) => ({
  tiles: {},
  roads: [],
  towns: [],
  players: [],
  currentPlayer: game.PlayerId.green,

  initialise: () => set(() => game.initialiseGame()),
  buildTown: (id: string) =>
    set((state) => ({
      towns: state.towns.map((town) =>
        town.id === id
          ? {
              ...town,
              owner: game.PlayerId.green,
            }
          : town,
      ),
    })),
}))

export default useStore
