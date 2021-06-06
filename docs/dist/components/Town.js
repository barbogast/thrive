import React from "../../_snowpack/pkg/react.js";
import {Circle} from "../../_snowpack/pkg/react-konva.js";
import * as axial from "../axial.js";
import * as routing from "../routing.js";
import * as setters from "../state/setters.js";
import {useCurrentGame} from "../state/gameState.js";
const Town = function Town2({position: position2, owner}) {
  const gameId = routing.useGameId();
  const localStore = useCurrentGame((game2) => ({
    color: owner ? game2.players[owner].color : void 0
  }));
  const middle = axial.getMiddle(position2);
  const style = owner ? {
    fill: localStore.color
  } : {
    stroke: "black",
    strokeWidth: 1
  };
  return /* @__PURE__ */ React.createElement(Circle, {
    type: "town",
    x: middle.x,
    y: middle.y,
    radius: 10,
    onClick: owner ? void 0 : () => setters.buildTown(gameId, position2),
    ...style
  });
};
export default Town;
