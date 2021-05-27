import create, { StateSelector, UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import { GetState, immerMiddleware, SetState } from './utils'

import * as game from '../game'
import * as routing from '../routing'

export type GameState = {
  games: {
    [gameId: string]: game.GameState
  }
  get: GetState<GameState>
  set: SetState<GameState>
}

export function initialiseStore(onRehydrated: () => void): UseStore<GameState> {
  return create<GameState>(
    persist(
      immerMiddleware((set, get) => {
        return {
          set,
          get,
          games: {},
        }
      }),
      {
        name: 'games',
        onRehydrateStorage: () => onRehydrated,
      },
    ),
  )
}

export const {
  Provider,
  useStore: useGameStore,
  // @ts-ignore
  context,
  useStoreApi: useGameStoreApi,
} = createContext<GameState>()

export function useCurrentGame<U>(
  selector: StateSelector<game.GameState, U>,
): U {
  const gameId = routing.useGameId()
  return useGameStore((state: GameState) => selector(state.games[gameId]))
}
