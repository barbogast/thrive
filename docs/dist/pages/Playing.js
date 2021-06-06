import React from "../../_snowpack/pkg/react.js";
import {useCurrentGame} from "../state/gameState.js";
import Board from "../components/Board.js";
import Stage from "../components/Stage.js";
import Controls from "../components/Controls.js";
import Players from "../components/Players.js";
import * as game from "../game.js";
import Box from "../components/Box.js";
const Playing = function Playing2() {
  const gameStore = useCurrentGame((game2) => ({
    sequence: game2.sequence,
    currentAction: game2.sequence.scheduledActions[0],
    currentPlayerColor: game2.players[game2.sequence.scheduledActions[0].playerId].color,
    currentDiceRoll: game2.currentDiceRoll
  }));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => window.history.back()
  }, "Back"), /* @__PURE__ */ React.createElement("div", null, "Current player ", /* @__PURE__ */ React.createElement(Box, {
    color: gameStore.currentPlayerColor
  }), ":", " ", gameStore.currentAction.type, /* @__PURE__ */ React.createElement("br", null)), gameStore.sequence.phaseType === "normal" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Players, null), /* @__PURE__ */ React.createElement("div", null, gameStore.currentAction.type !== game.GameActionType.rollDice ? "Current dice roll: " + gameStore.currentDiceRoll.join(" | ") : ""), /* @__PURE__ */ React.createElement(Controls, null), /* @__PURE__ */ React.createElement("br", null)) : /* @__PURE__ */ React.createElement(React.Fragment, null), /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Board, null)));
};
export default Playing;
