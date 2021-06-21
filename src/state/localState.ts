import create, { UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { customAlphabet } from 'nanoid'
import { immerMiddleware } from './utils'
import produce, { Draft } from 'immer'
import * as game from '../lib/game'

export type Friend = {
  id: string
  peerId: string
  name: string
}

export type Board = {
  name: string
  tiles: game.Tile[]
}

export type LocalState = {
  myId: string
  friends: {
    [id: string]: Friend
  }
  customBoards: {
    [id: string]: Board
  }
}

export function initialiseStore(): UseStore<LocalState> {
  return create<LocalState>(
    persist(
      immerMiddleware(() => {
        // Omit special characters so the id can be used with peerjs (which dislikes "-")
        const aphabet =
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const getId = customAlphabet(aphabet, 21)

        const myId = getId()
        return {
          myId,
          friends: {
            [myId]: { id: myId, peerId: myId, name: '' },
          },
          customBoards: {},
        }
      }),
      {
        name: 'state',
      },
    ),
  )
}

export const useLocalStore = initialiseStore()

export function setLocalState(fn: (draft: Draft<LocalState>) => void): void {
  useLocalStore.setState(produce(fn))
}
