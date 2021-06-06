import React from "../../_snowpack/pkg/react.js";
import {Group, RegularPolygon, Text} from "../../_snowpack/pkg/react-konva.js";
import {visualConfig} from "../constants.js";
import * as axial from "../axial.js";
export function getColorForTileType(tileType) {
  return {
    grain: "yellow",
    wood: "darkgreen",
    brick: "#873600",
    sheep: "lightgreen",
    ore: "grey",
    desert: "lightyellow"
  }[tileType];
}
const HexTile = function HexTile2({tile}) {
  const pxPosition = axial.getTilePosition(tile.position);
  return /* @__PURE__ */ React.createElement(Group, {
    x: pxPosition.x,
    y: pxPosition.y
  }, /* @__PURE__ */ React.createElement(RegularPolygon, {
    sides: 6,
    rotation: visualConfig().flatTopped ? 30 : 0,
    radius: visualConfig().tileRadius + 1,
    fill: getColorForTileType(tile.resource),
    stroke: "black",
    strokeWidth: 1,
    id: "asdf" + pxPosition.x + pxPosition.y
  }), tile.number ? /* @__PURE__ */ React.createElement(Text, {
    text: String(tile.number),
    fontSize: 14,
    fontFamily: "Arial",
    offsetX: 6,
    offsetY: 3,
    fontVariant: "bold"
  }) : null);
};
export default HexTile;
