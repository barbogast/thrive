import create from "../../_snowpack/pkg/zustand.js";
import {persist} from "../../_snowpack/pkg/zustand/middleware.js";
import {immerMiddleware} from "./utils.js";
import * as routing from "../routing.js";
import produce from "../../_snowpack/pkg/immer.js";
export function initialiseStore() {
  return create(persist(immerMiddleware((set, get) => {
    return {
      set,
      get,
      games: {}
    };
  }), {
    name: "games"
  }));
}
export const useGameStore = initialiseStore();
export function setGameState(fn) {
  useGameStore.setState(produce(fn));
}
export function useCurrentGame(selector) {
  const gameId = routing.useGameId();
  return useGameStore((state) => selector(state.games[gameId]));
}
