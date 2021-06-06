import create from "../../_snowpack/pkg/zustand.js";
import {immerMiddleware} from "./utils.js";
import produce from "../../_snowpack/pkg/immer.js";
export const UiActionType = {
  buildRoad: "buildRoad",
  buildTown: "buildTown",
  rollDice: "rollDice",
  endTurn: "endTurn",
  none: "none"
};
export function initialiseStore() {
  return create(immerMiddleware((set, get) => {
    return {
      set,
      get,
      currentAction: {type: UiActionType.none},
      connectedFriends: [],
      friendState: {},
      boardSettings: {type: "hex", size: "5"}
    };
  }));
}
export const useTempStore = initialiseStore();
export function setTempState(fn) {
  useTempStore.setState(produce(fn));
}
