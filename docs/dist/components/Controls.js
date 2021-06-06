import React from "../../_snowpack/pkg/react.js";
import * as routing from "../routing.js";
import * as game from "../game.js";
import * as setters from "../state/setters.js";
import {useLocalStore} from "../state/localState.js";
import {useCurrentGame} from "../state/gameState.js";
import {UiActionType} from "../state/tempState.js";
const Controls = function Controls2() {
  const gameId = routing.useGameId();
  const localStore = useLocalStore((state) => ({
    myId: state.myId
  }));
  const gameStore = useCurrentGame((game2) => ({
    currentAction: game2.sequence.scheduledActions[0],
    players: game2.players
  }));
  const allowedActions = game.getAllowedUiActions(gameStore.currentAction);
  const player = gameStore.players[gameStore.currentAction.playerId];
  if (player.peerId !== localStore.myId) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, "Waiting for ", player.name);
  }
  return /* @__PURE__ */ React.createElement("div", null, allowedActions.includes(UiActionType.buildRoad) ? /* @__PURE__ */ React.createElement("button", {
    onClick: () => setters.toggleCurrentAction(UiActionType.buildRoad),
    style: {
      boxShadow: gameStore.currentAction.type === UiActionType.buildRoad ? "0 0 0 2px black" : ""
    }
  }, "Build road") : /* @__PURE__ */ React.createElement(React.Fragment, null), "  ", allowedActions.includes(UiActionType.buildTown) ? /* @__PURE__ */ React.createElement("button", {
    onClick: () => setters.toggleCurrentAction(UiActionType.buildTown),
    style: {
      boxShadow: gameStore.currentAction.type === UiActionType.buildTown ? "0 0 0 2px black" : ""
    }
  }, "Build town") : /* @__PURE__ */ React.createElement(React.Fragment, null), "  ", allowedActions.includes(UiActionType.endTurn) ? /* @__PURE__ */ React.createElement("button", {
    onClick: () => setters.nextTurn(gameId)
  }, "Finish turn") : /* @__PURE__ */ React.createElement(React.Fragment, null), "  ", allowedActions.includes(UiActionType.rollDice) ? /* @__PURE__ */ React.createElement("button", {
    onClick: () => setters.rollDice(gameId)
  }, "Roll dice") : /* @__PURE__ */ React.createElement(React.Fragment, null));
};
export default Controls;
