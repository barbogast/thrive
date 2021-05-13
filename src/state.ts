import create from 'zustand'
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
  gameState: game.GameState
  uiState: {
    currentAction: Action
  }
}

type Setter = {
  initialise: () => void
  buildTown: (position: position.Position) => void
  buildRoad: (position: position.Position) => void
  nextTurn: () => void
  toggleCurrentAction: (action: ActionType) => void
  updateGameState: (gameState: game.GameState) => void
}

const useStore = create<State & Setter>((set) => {
  const iSet = (fn: (state: State) => void) => set(produce(fn))
  return {
    gameState: {
      tiles: {},
      roads: [],
      towns: [],
      players: game.initialisePlayers(),
      currentPlayer: game.PlayerId.green,
      currentDiceRoll: [],
    },
    uiState: {
      currentAction: { type: ActionType.none },
    },

    initialise: () => iSet(() => ({ gameState: game.initialiseGame() })),

    buildTown: (position: position.Position) =>
      iSet((draft) => {
        game.buildTown(draft.gameState, position)
        draft.uiState.currentAction = { type: ActionType.none }
      }),

    buildRoad: (position: position.Position) =>
      iSet((draft) => {
        game.buildRoad(draft.gameState, position)
        draft.uiState.currentAction = { type: ActionType.none }
      }),

    nextTurn: () =>
      iSet((draft) => {
        draft.uiState.currentAction = { type: ActionType.none }
        game.rollDice(draft.gameState)
        draft.gameState.currentPlayer = game.getNextPlayer(
          draft.gameState.currentPlayer,
        )
      }),

    toggleCurrentAction: (actionType: ActionType) =>
      iSet((draft) => {
        if (actionType === draft.uiState.currentAction.type) {
          draft.uiState.currentAction = { type: ActionType.none }
          return
        }

        switch (actionType) {
          case ActionType.buildRoad: {
            draft.uiState.currentAction = {
              type: actionType,
              positions: board.getRoadPositions(draft.gameState.tiles),
            }
            break
          }

          case ActionType.buildTown: {
            draft.uiState.currentAction = {
              type: actionType,
              positions: board.getTownPositions(draft.gameState.tiles),
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

    updateGameState: (gameState) =>
      iSet((draft) => {
        draft.gameState = gameState
      }),
  }
})

export default useStore
