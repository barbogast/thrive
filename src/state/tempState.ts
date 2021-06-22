import create, { UseStore } from 'zustand'
import Peer, { DataConnection } from 'peerjs'
import { immerMiddleware } from './utils'
import { BoardSettings, Tile } from '../lib/board'
import produce, { Draft } from 'immer'

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

export type FriendState = {
  isSelected: boolean
  connection?: DataConnection
}

export type TempState = {
  currentAction: UiAction
  friendState: { [friendId: string]: FriendState }
  boardSettings: BoardSettings
  pointsForVictory: number | void
  boardMode: 'custom' | 'random'
  selectedCustomBoardId: string | void
  currentTiles: Tile[]
  peerJsConnection: Peer | void
}

export const hexDefault: BoardSettings = { type: 'hex', size: '5' }
export const squareDefault: BoardSettings = {
  type: 'square',
  rows: 7,
  columns: 7,
}

export function initialiseStore(): UseStore<TempState> {
  return create<TempState>(
    immerMiddleware(() => {
      const s: TempState = {
        currentAction: { type: 'none' },
        friendState: {},
        boardSettings: hexDefault,
        boardMode: 'custom',
        selectedCustomBoardId: undefined,
        peerJsConnection: undefined,
        currentTiles: [],
        pointsForVictory: 10,
      }

      return s
    }),
  )
}

export const useTempStore = initialiseStore()

export function setTempState(fn: (draft: Draft<TempState>) => void): void {
  useTempStore.setState(produce(fn))
}
