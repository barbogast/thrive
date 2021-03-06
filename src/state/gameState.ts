import create, { StateSelector, UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { immerMiddleware } from './utils'

import * as game from '../lib/game'
import * as routing from '../lib/routing'
import produce, { Draft } from 'immer'

type Games = {
  games: {
    [gameId: string]: game.Game
  }
}

export function initialiseStore(): UseStore<Games> {
  return create<Games>(
    persist(
      immerMiddleware(() => {
        return {
          games: {},
        }
      }),
      {
        name: 'games',
        version: 1,
        migrate: (state, version) => {
          if (version === 0) {
            for (const gameId of Object.keys(state.games)) {
              const game = state.games[gameId]
              for (const tileId of Object.keys(game.tiles)) {
                const tile = game.tiles[tileId]
                game.tiles[tileId] = {
                  type: tile.resource,
                  position: tile.position,
                  number: tile.number,
                }
              }
            }
            return state
          } else {
            throw new Error(`Migration for v${version} not supported`)
          }
        },
      },
    ),
  )
}

export const useGameStore = initialiseStore()

export function setGameState(fn: (draft: Draft<Games>) => void): void {
  useGameStore.setState(produce(fn))
}

export function useCurrentGame<U>(selector: StateSelector<game.Game, U>): U {
  const gameId = routing.useGameId()
  return useGameStore((state: Games) => selector(state.games[gameId]))
}
