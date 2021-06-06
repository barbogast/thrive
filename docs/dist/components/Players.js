import React from "../../_snowpack/pkg/react.js";
import {getColorForTileType} from "./HexTile.js";
import {useLocalStore} from "../state/localState.js";
import {useCurrentGame} from "../state/gameState.js";
import Box from "./Box.js";
import * as game from "../game.js";
import ConnectionStatus from "./ConnectionStatus.js";
const Players = function Players2() {
  const {myId} = useLocalStore((state) => ({
    myId: state.myId
  }));
  const {players} = useCurrentGame((game2) => ({
    players: game2.players
  }));
  return /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", flexDirection: "row"}
  }, Object.values(players).map((player) => {
    return /* @__PURE__ */ React.createElement("div", {
      style: {border: `1px solid ${player.color}`},
      key: player.id
    }, /* @__PURE__ */ React.createElement("div", {
      style: {backgroundColor: player.color}
    }, player.name, player.peerId !== myId ? /* @__PURE__ */ React.createElement(ConnectionStatus, {
      id: player.peerId
    }) : /* @__PURE__ */ React.createElement(React.Fragment, null)), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Box, {
      color: getColorForTileType(game.Resource.wood)
    }), "  Wood: ", player.resources.wood), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Box, {
      color: getColorForTileType(game.Resource.brick)
    }), "  Brick: ", player.resources.brick), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Box, {
      color: getColorForTileType(game.Resource.grain)
    }), "  Grain: ", player.resources.grain), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Box, {
      color: getColorForTileType(game.Resource.sheep)
    }), "  Sheep: ", player.resources.sheep), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Box, {
      color: getColorForTileType(game.Resource.wood)
    }), "   Ore: ", player.resources.ore)));
  }));
};
export default Players;
