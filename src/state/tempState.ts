import create, { UseStore } from 'zustand'
import { DataConnection } from 'peerjs'
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

export type FriendState = {
  isSelected: boolean
  connection?: DataConnection
}

export type TempState = {
  currentAction: UiAction
  friendState: { [friendId: string]: FriendState }

  get: GetState<TempState>
  set: SetState<TempState>
}

export function initialiseStore(): UseStore<TempState> {
  return create<TempState>(
    immerMiddleware((set, get) => {
      return {
        set,
        get,
        currentAction: { type: UiActionType.none },
        connectedFriends: [],
        friendState: {},
      }
    }),
  )
}

export const useTempStore = initialiseStore()
