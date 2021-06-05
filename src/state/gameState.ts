import create, { StateSelector, UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
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

export function initialiseStore(): UseStore<GameState> {
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
      },
    ),
  )
}

export const useGameStore = initialiseStore()

export function useCurrentGame<U>(
  selector: StateSelector<game.GameState, U>,
): U {
  const gameId = routing.useGameId()
  return useGameStore((state: GameState) => selector(state.games[gameId]))
}
