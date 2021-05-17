import create, { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import produce, { Draft } from 'immer'

import * as game from './game'
import * as position from './position'
import * as board from './board'

export const ActionType = {
  buildRoad: 'buildRoad',
  buildTown: 'buildTown',
  none: 'none',
} as const
export type ActionType = typeof ActionType[keyof typeof ActionType]

export type Action =
  | {
      type: 'none'
    }
  | {
      type: 'buildRoad'
      positions: position.Position[]
    }
  | {
      type: 'buildTown'
      positions: position.Position[]
    }

type State = {
  player: {
    id: string | void
    name: string
  }
  friends: {
    [id: string]: {
      id: string
      isRemote: boolean
    }
  }
  games: {
    [gameId: string]: game.GameState
  }
  uiState: {
    currentAction: Action
    connectedFriends: string[]
  }
}

type Setter = {
  setPlayerId: (playerId: string) => void
  setPlayerName: (playerName: string) => void
  connectToPlayer: (playerId: string) => void
  friendDisconnected: (playerId: string) => void
  addLocalPlayer: (playerId: string) => void
  initialise: (gameId: string, friendIds: string[]) => void
  buildTown: (gameId: string, position: position.Position) => void
  buildRoad: (gameId: string, position: position.Position) => void
  nextTurn: (
    gameId: string,
    sendState: (gameId: string, newState: game.GameState) => void,
  ) => void
  toggleCurrentAction: (gameId: string, action: ActionType) => void
  updateGameState: (gameId: string, gameState: game.GameState) => void
}

const immer =
  <T extends State>(
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api)

export function initialiseStore(onRehydrated: () => void) {
  return create<State & Setter>(
    persist(
      immer((set, get) => {
        return {
          player: {
            id: undefined,
            name: '',
          },
          friends: {},
          games: {},
          uiState: {
            currentAction: { type: ActionType.none },
            connectedFriends: [],
          },

          setPlayerId: (playerId: string) =>
            set((draft) => {
              draft.player.id = playerId
            }),

          setPlayerName: (playerName: string) => {
            set((draft) => {
              draft.player.name = playerName
            })
          },

          connectToPlayer: (playerId: string) =>
            set((draft) => {
              draft.friends[playerId] = { id: playerId, isRemote: true }
              draft.uiState.connectedFriends.push(playerId)
            }),

          addLocalPlayer: (playerId: string) =>
            set((draft) => {
              draft.friends[playerId] = { id: playerId, isRemote: false }
            }),

          friendDisconnected: (playerId: string) =>
            set((draft) => {
              draft.uiState.connectedFriends.filter((id) => id !== playerId)
            }),

          initialise: (gameId: string, friendIds: string[]) =>
            set((draft) => {
              draft.games[gameId] = game.initialiseGame(friendIds)
            }),

          buildTown: (gameId: string, position: position.Position) =>
            set((draft) => {
              game.buildTown(draft.games[gameId], position)
              draft.uiState.currentAction = { type: ActionType.none }
            }),

          buildRoad: (gameId: string, position: position.Position) =>
            set((draft) => {
              game.buildRoad(draft.games[gameId], position)
              draft.uiState.currentAction = { type: ActionType.none }
            }),

          nextTurn: (
            gameId: string,
            sendState: (gameId: string, newState: game.GameState) => void,
          ) => {
            set((draft) => {
              draft.uiState.currentAction = { type: ActionType.none }
              game.rollDice(draft.games[gameId])
              game.getNextPlayer(draft.games[gameId])
            })
            sendState(gameId, get().games[gameId])
          },

          toggleCurrentAction: (gameId: string, actionType: ActionType) =>
            set((draft) => {
              if (actionType === draft.uiState.currentAction.type) {
                draft.uiState.currentAction = { type: ActionType.none }
                return
              }

              switch (actionType) {
                case ActionType.buildRoad: {
                  draft.uiState.currentAction = {
                    type: actionType,
                    positions: board.getRoadPositions(
                      draft.games[gameId].tiles,
                    ),
                  }
                  break
                }

                case ActionType.buildTown: {
                  draft.uiState.currentAction = {
                    type: actionType,
                    positions: board.getTownPositions(
                      draft.games[gameId].tiles,
                    ),
                  }
                  break
                }

                case ActionType.none: {
                  draft.uiState.currentAction = { type: actionType }
                  break
                }

                default:
                  const exhaustiveCheck: never = actionType
                  throw new Error(`Unhandled case: ${exhaustiveCheck}`)
              }
            }),

          updateGameState: (gameId: string, gameState: game.GameState) =>
            set((draft) => {
              draft.games[gameId] = gameState
            }),
        }
      }),
      {
        name: 'state',
        whitelist: ['games', 'player', 'friends'],
        onRehydrateStorage: () => onRehydrated,
      },
    ),
  )
}

export const { Provider, useStore } = createContext<State & Setter>()
