import create, { UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { customAlphabet } from 'nanoid'
import { immerMiddleware } from './utils'
import produce, { Draft } from 'immer'
import { Tile } from '../lib/board'

export type Friend = {
  id: string
  peerId: string
  name: string
}

export type CustomBoard = {
  id: string
  name: string
  tiles: Tile[]
}

export type LocalState = {
  myId: string
  friends: {
    [id: string]: Friend
  }
  customBoards: {
    [id: string]: CustomBoard
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
        version: 1,
        migrate: (state, version) => {
          if (version === 0) {
            for (const boardId of Object.keys(state.customBoards)) {
              const board = state.customBoards[boardId]
              for (const tileId of Object.keys(board.tiles)) {
                const tile = board.tiles[tileId]
                board.tiles[tileId] = {
                  type: tile.resource,
                  position: tile.position,
                  number: tile.number,
                }
              }
            }
            return state
          } else {
            throw new Error(`Migration for v${version} not supported`)
          }
        },
      },
    ),
  )
}

export const useLocalStore = initialiseStore()

export function setLocalState(fn: (draft: Draft<LocalState>) => void): void {
  useLocalStore.setState(produce(fn))
}
