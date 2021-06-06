import create, { UseStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { customAlphabet } from 'nanoid'
import { GetState, immerMiddleware, SetState } from './utils'
import produce, { Draft } from 'immer'

export type Friend = {
  id: string
  peerId: string
  name: string
}

export type LocalState = {
  myId: string
  friends: {
    [id: string]: Friend
  }
  get: GetState<LocalState>
  set: SetState<LocalState>
}

export function initialiseStore(): UseStore<LocalState> {
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
