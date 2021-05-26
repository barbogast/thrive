import { State } from 'zustand'
import { GameState, useGameStore } from './gameState'
import { LocalState, useLocalStore } from './localState'
import { GetState, SetState } from './utils'

export type Stores = {
  local: {
    get: GetState<LocalState>
    set: SetState<LocalState>
  }
  game: {
    get: GetState<GameState>
    set: SetState<GameState>
  }
}

function selector<T extends State>(state: {
  get: GetState<T>
  set: SetState<T>
}) {
  return {
    get: state.get,
    set: state.set,
  }
}

export const useStores = (): Stores => {
  const local = useLocalStore(selector)
  const game = useGameStore(selector)
  return { local, game } as const
}
