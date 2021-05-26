import create, { GetState, StateCreator, UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import produce, { Draft } from 'immer'
import { DataConnection } from 'peerjs'
import { customAlphabet } from 'nanoid'

import * as game from './game'

export const UiActionType = {
  buildRoad: 'buildRoad',
  buildTown: 'buildTown',
  rollDice: 'rollDice',
  endTurn: 'endTurn',
  none: 'none',
} as const
export type UiActionType = typeof UiActionType[keyof typeof UiActionType]

export type UiAction =
  | {
      type: 'none'
    }
  | {
      type: 'buildRoad'
    }
  | {
      type: 'buildTown'
    }
  | {
      type: 'rollDice'
    }
  | {
      type: 'endTurn'
    }

export type Friend = {
  id: string
  peerId: string
  name: string
}

export type FriendState = {
  isSelected: boolean
  connection?: DataConnection
}

export type State = {
  myId: string
  friends: {
    [id: string]: Friend
  }
  games: {
    [gameId: string]: game.GameState
  }
  uiState: {
    currentAction: UiAction
    friendState: { [friendId: string]: FriendState }
  }
}

type Set = (fn: (draft: Draft<State & Setter>) => void) => void
type Get = GetState<State & Setter>
export type Store = { set: Set; get: Get }

export type Setter = {
  get: Get
  set: Set
}

const immer =
  <T extends State>(
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api)

export function initialiseStore(
  onRehydrated: () => void,
): UseStore<State & Setter> {
  return create<State & Setter>(
    persist(
      immer((set, get) => {
        // Omit special characters so the id can be used with peerjs (which dislikes "-")
        const aphabet =
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const getId = customAlphabet(aphabet, 21)

        const myId = getId()
        return {
          set,
          get,
          myId,
          friends: {
            [myId]: { id: myId, peerId: myId, name: '' },
          },
          games: {},
          uiState: {
            currentAction: { type: UiActionType.none },
            connectedFriends: [],
            friendState: {},
          },
        }
      }),
      {
        name: 'state',
        whitelist: ['games', 'myId', 'friends'],
        onRehydrateStorage: () => onRehydrated,
      },
    ),
  )
}

// @ts-ignore
export const { Provider, useStore, context } = createContext<State & Setter>()
