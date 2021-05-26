import { GetState as Z_GetState, State, StateCreator } from 'zustand'
import { produce, Draft } from 'immer'

export type GetState<T extends State> = Z_GetState<T>
export type SetState<T> = (fn: (draft: Draft<T>) => void) => void

export const immerMiddleware =
  <T extends State>(config: StateCreator<T, SetState<T>>): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api)
