import create, { StateSelector, UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { immerMiddleware } from './utils'

import * as game from '../lib/game'
import * as routing from '../lib/routing'
import produce, { Draft } from 'immer'

export type GameState = {
  games: {
    [gameId: string]: game.GameState
  }
}

export function initialiseStore(): UseStore<GameState> {
  return create<GameState>(
    persist(
      immerMiddleware(() => {
        return {
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

export function setGameState(fn: (draft: Draft<GameState>) => void): void {
  useGameStore.setState(produce(fn))
}

export function useCurrentGame<U>(
  selector: StateSelector<game.GameState, U>,
): U {
  const gameId = routing.useGameId()
  return useGameStore((state: GameState) => selector(state.games[gameId]))
}
