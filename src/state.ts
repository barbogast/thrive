import create from 'zustand'
import { persist } from 'zustand/middleware'
import createContext from 'zustand/context'
import produce from 'immer'

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
  }
  games: {
    [gameId: string]: game.GameState
  }
  uiState: {
    currentAction: Action
  }
}

type Setter = {
  setPlayerId: (playerId: string) => void
  initialise: (gameId: string) => void
  buildTown: (gameId: string, position: position.Position) => void
  buildRoad: (gameId: string, position: position.Position) => void
  nextTurn: (gameId: string) => void
  toggleCurrentAction: (gameId: string, action: ActionType) => void
  updateGameState: (gameId: string, gameState: game.GameState) => void
}

export function initialiseStore(onRehydrated: () => void) {
  return create<State & Setter>(
    persist(
      (set) => {
        const iSet = (fn: (state: State) => void) => set(produce(fn))
        return {
          player: {
            id: undefined,
          },
          games: {},
          uiState: {
            currentAction: { type: ActionType.none },
          },

          setPlayerId: (playerId: string) =>
            iSet((draft) => {
              draft.player = { id: playerId }
            }),

          initialise: (gameId: string) =>
            iSet((draft) => {
              draft.games[gameId] = game.initialiseGame()
            }),

          buildTown: (gameId: string, position: position.Position) =>
            iSet((draft) => {
              game.buildTown(draft.games[gameId], position)
              draft.uiState.currentAction = { type: ActionType.none }
            }),

          buildRoad: (gameId: string, position: position.Position) =>
            iSet((draft) => {
              game.buildRoad(draft.games[gameId], position)
              draft.uiState.currentAction = { type: ActionType.none }
            }),

          nextTurn: (gameId: string) =>
            iSet((draft) => {
              draft.uiState.currentAction = { type: ActionType.none }
              game.rollDice(draft.games[gameId])
              draft.games[gameId].currentPlayer = game.getNextPlayer(
                draft.games[gameId].currentPlayer,
              )
            }),

          toggleCurrentAction: (gameId: string, actionType: ActionType) =>
            iSet((draft) => {
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
            iSet((draft) => {
              draft.games[gameId] = gameState
            }),
        }
      },
      {
        name: 'state',
        whitelist: ['games', 'player'],
        onRehydrateStorage: () => onRehydrated,
      },
    ),
  )
}

export const { Provider, useStore } = createContext<State & Setter>()
