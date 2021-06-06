import React from "../../_snowpack/pkg/react.js";
import {Rect} from "../../_snowpack/pkg/react-konva.js";
import {visualConfig} from "../constants.js";
import * as axial from "../axial.js";
import * as routing from "../routing.js";
import * as setters from "../state/setters.js";
import {useCurrentGame} from "../state/gameState.js";
const Road = function Road2({position: position2, owner}) {
  const gameId = routing.useGameId();
  const gameStore = useCurrentGame((game2) => ({
    color: owner ? game2.players[owner].color : void 0
  }));
  const [tile1, tile2] = position2;
  const direction = axial.getDirection(tile1, tile2);
  const directionToDegree = {
    0: 90,
    1: 150,
    2: 210,
    3: 270,
    4: 330,
    5: 30
  };
  const middle = axial.getMiddle(position2);
  const style = owner ? {fill: gameStore.color} : {stroke: "black", strokeWidth: 1};
  return /* @__PURE__ */ React.createElement(Rect, {
    x: middle.x,
    y: middle.y,
    offsetX: visualConfig().tileRadius / 2,
    offsetY: 3,
    width: visualConfig().tileRadius,
    height: 7,
    rotation: directionToDegree[direction],
    ...style,
    onClick: owner ? void 0 : () => setters.buildRoad(gameId, position2)
  });
};
export default Road;
