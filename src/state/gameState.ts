import create, { GetState, StateCreator, UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import produce, { Draft } from 'immer'

import * as game from '../game'

type Set = (fn: (draft: Draft<GameState>) => void) => void
type Get = GetState<GameState>

export type GameState = {
  games: {
    [gameId: string]: game.GameState
  }
  get: Get
  set: Set
}

export type Store = { set: Set; get: Get }

const immer =
  <T extends GameState>(
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api)

export function initialiseStore(onRehydrated: () => void): UseStore<GameState> {
  return create<GameState>(
    persist(
      immer((set, get) => {
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
