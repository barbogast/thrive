import create, { GetState, StateCreator, UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import produce, { Draft } from 'immer'
import { DataConnection } from 'peerjs'
import { customAlphabet } from 'nanoid'

import * as game from './game'
import * as position from './position'
import { getControllers } from './hooks/useConnection'

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
  setMyName: (name: string) => void
  setFriendName: (friendId: string, name: string) => void
  toggleFriendSelection: (friendId: string) => void
  addFriendConnection: (
    friendId: string,
    name: string,
    connection: DataConnection,
  ) => void
  removeFriendConnection: (friendId: string) => void
  addLocalPlayer: (playerId: string, name: string) => void
  removeSelectedPlayers: () => void
  initialise: (gameId: string, friends: Friend[]) => void
  buildTown: (gameId: string, position: position.Position) => void
  buildRoad: (gameId: string, position: position.Position) => void
  nextTurn: (gameId: string) => void
  rollDice: (gameId: string) => void
  toggleCurrentAction: (action: UiActionType) => void
  updateGameState: (gameId: string, gameState: game.GameState) => void
}

const immer =
  <T extends State>(
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api)

function updateFriendState(
  draft: State,
  friendId: string,
  cb: (friendState: FriendState) => void,
) {
  if (!draft.uiState.friendState[friendId]) {
    draft.uiState.friendState[friendId] = { isSelected: false }
  }
  cb(draft.uiState.friendState[friendId])
}

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

        const controllers = getControllers({ set, get })

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

          setMyName: (name: string) => {
            set((draft) => {
              draft.friends[draft.myId].name = name
            })
          },

          setFriendName: (friendId: string, name: string) => {
            set((draft) => {
              draft.friends[friendId].name = name
            })
          },

          toggleFriendSelection: (friendId: string) =>
            set((draft) => {
              updateFriendState(draft, friendId, (friendState) => {
                friendState.isSelected = !friendState.isSelected
              })
            }),

          addFriendConnection: (
            friendId: string,
            name: string,
            connection: DataConnection,
          ) =>
            set((draft) => {
              draft.friends[friendId] = { id: friendId, peerId: friendId, name }
              updateFriendState(draft, friendId, (friendState) => {
                friendState.connection = connection
              })
            }),

          removeFriendConnection: (friendId: string) =>
            set((draft) => {
              updateFriendState(draft, friendId, (friendState) => {
                delete friendState.connection
              })
            }),

          addLocalPlayer: (playerId: string, name: string) =>
            set((draft) => {
              draft.friends[playerId] = {
                id: playerId,
                peerId: draft.myId,
                name,
              }
            }),

          removeSelectedPlayers: () =>
            set((draft) => {
              for (const [friendId, friendState] of Object.entries(
                draft.uiState.friendState,
              )) {
                if (friendState.isSelected) {
                  draft.uiState.friendState[friendId].connection?.close()
                  delete draft.uiState.friendState[friendId]
                  delete draft.friends[friendId]
                }
              }
            }),

          initialise: (gameId: string, friends: Friend[]) =>
            set((draft) => {
              draft.games[gameId] = game.initialiseGame(friends)
            }),

          buildTown: (gameId: string, position: position.Position) =>
            set((draft) => {
              game.buildTown(draft.games[gameId], position)
              draft.uiState.currentAction = { type: UiActionType.none }
            }),

          buildRoad: (gameId: string, position: position.Position) =>
            set((draft) => {
              game.buildRoad(draft.games[gameId], position)
              draft.uiState.currentAction = { type: UiActionType.none }
            }),

          nextTurn: (gameId: string) => {
            set((draft) => {
              draft.uiState.currentAction = { type: UiActionType.none }
              game.endTurn(draft.games[gameId])
            })
            controllers.sendState(gameId, get().games[gameId])
          },

          rollDice: (gameId: string) => {
            set((draft) => {
              game.rollDice(draft.games[gameId])
            })
          },

          toggleCurrentAction: (actionType: UiActionType) =>
            set((draft) => {
              draft.uiState.currentAction =
                actionType === draft.uiState.currentAction.type
                  ? { type: UiActionType.none }
                  : { type: actionType }
            }),

          updateGameState: (gameId: string, gameState: game.GameState) =>
            set((draft) => {
              draft.games[gameId] = gameState
            }),
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

function storeSelector(state: State & Setter) {
  return { get: state.get, set: state.set }
}

export function useController<F>(cb: (store: Store) => F): F {
  const store = useStore(storeSelector)
  return cb(store)
}
