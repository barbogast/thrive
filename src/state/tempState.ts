import create, { UseStore } from 'zustand'
import { DataConnection } from 'peerjs'
import { immerMiddleware } from './utils'
import { BoardSettings } from '../game'
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
}

export function initialiseStore(): UseStore<TempState> {
  return create<TempState>(
    immerMiddleware(() => {
      const s: TempState = {
        currentAction: { type: 'none' },
        friendState: {},
        boardSettings: { type: 'hex', size: '5' },
      }

      return s
    }),
  )
}

export const useTempStore = initialiseStore()

export function setTempState(fn: (draft: Draft<TempState>) => void): void {
  useTempStore.setState(produce(fn))
}
