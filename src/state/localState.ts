import create, { UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import { DataConnection } from 'peerjs'
import { customAlphabet } from 'nanoid'
import { GetState, immerMiddleware, SetState } from './utils'

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

export type LocalState = {
  myId: string
  friends: {
    [id: string]: Friend
  }
  uiState: {
    currentAction: UiAction
    friendState: { [friendId: string]: FriendState }
  }
  get: GetState<LocalState>
  set: SetState<LocalState>
}

export function initialiseStore(
  onRehydrated: () => void,
): UseStore<LocalState> {
  return create<LocalState>(
    persist(
      immerMiddleware((set, get) => {
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
          uiState: {
            currentAction: { type: UiActionType.none },
            connectedFriends: [],
            friendState: {},
          },
        }
      }),
      {
        name: 'state',
        whitelist: ['myId', 'friends'],
        onRehydrateStorage: () => onRehydrated,
      },
    ),
  )
}

export const {
  Provider,
  useStore: useLocalStore,
  // @ts-ignore
  context,
} = createContext<LocalState>()
