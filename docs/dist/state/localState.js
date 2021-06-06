import create from "../../_snowpack/pkg/zustand.js";
import {persist} from "../../_snowpack/pkg/zustand/middleware.js";
import {customAlphabet} from "../../_snowpack/pkg/nanoid.js";
import {immerMiddleware} from "./utils.js";
import produce from "../../_snowpack/pkg/immer.js";
export function initialiseStore() {
  return create(persist(immerMiddleware((set, get) => {
    const aphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const getId = customAlphabet(aphabet, 21);
    const myId = getId();
    return {
      set,
      get,
      myId,
      friends: {
        [myId]: {id: myId, peerId: myId, name: ""}
      }
    };
  }), {
    name: "state"
  }));
}
export const useLocalStore = initialiseStore();
export function setLocalState(fn) {
  useLocalStore.setState(produce(fn));
}
