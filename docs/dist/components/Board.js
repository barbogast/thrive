import React, {useEffect, useMemo} from "../../_snowpack/pkg/react.js";
import {Layer} from "../../_snowpack/pkg/react-konva.js";
import {useLocalStore} from "../state/localState.js";
import * as routing from "../routing.js";
import * as board from "../board.js";
import HexTile from "./HexTile.js";
import Road from "./Road.js";
import Town from "./Town.js";
import {useCurrentGame, useGameStore} from "../state/gameState.js";
import {sendState} from "../hooks/useConnection.js";
import {useTempStore, UiActionType} from "../state/tempState.js";
const Board = function Board2() {
  const gameId = routing.useGameId();
  const {myId} = useLocalStore((state) => ({
    myId: state.myId
  }));
  const tempStore = useTempStore((state) => ({
    uiAction: state.currentAction
  }));
  const gameStore = useCurrentGame((game) => ({
    roads: game.roads,
    towns: game.towns,
    tiles: game.tiles,
    sequenceAction: game.sequence.scheduledActions[0]
  }));
  const buildRoad = gameStore.sequenceAction.playerId === myId && (tempStore.uiAction.type === UiActionType.buildRoad || gameStore.sequenceAction.type === "buildRoad");
  const buildTown = gameStore.sequenceAction.playerId === myId && (tempStore.uiAction.type === UiActionType.buildTown || gameStore.sequenceAction.type === "buildTown");
  const positions = useMemo(() => {
    if (buildRoad) {
      return board.getRoadPositions(gameStore.tiles);
    } else if (buildTown) {
      return board.getTownPositions(gameStore.tiles);
    } else {
      return [];
    }
  }, [gameStore.tiles, buildRoad, buildTown]);
  useEffect(() => {
    return useGameStore.subscribe((newState, oldState) => {
      if (oldState.games[gameId].sequence.scheduledActions[0].playerId === myId)
        sendState(gameId);
    });
  }, []);
  return /* @__PURE__ */ React.createElement(Layer, null, Object.values(gameStore.tiles).map((t, i) => /* @__PURE__ */ React.createElement(HexTile, {
    key: i,
    tile: t
  })), buildRoad && positions.map((r, i) => /* @__PURE__ */ React.createElement(Road, {
    key: i,
    position: r
  })), buildTown && positions.map((r, i) => /* @__PURE__ */ React.createElement(Town, {
    key: i,
    position: r
  })), Object.values(gameStore.roads).map((r, i) => /* @__PURE__ */ React.createElement(Road, {
    key: i,
    position: r.position,
    owner: r.owner
  })), Object.values(gameStore.towns).map((t, i) => /* @__PURE__ */ React.createElement(Town, {
    key: i,
    position: t.position,
    owner: t.owner
  })));
};
export default Board;
