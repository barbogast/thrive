import create, { UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import { GetState, immerMiddleware, SetState } from './utils'

import * as game from '../game'

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
