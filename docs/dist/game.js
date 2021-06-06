import * as axial from "./axial.js";
import * as tileMap from "./tileMap.js";
import * as board from "./board.js";
import * as utils from "./utils.js";
import {gameConfig} from "./constants.js";
export const Resource = {
  grain: "grain",
  wood: "wood",
  brick: "brick",
  sheep: "sheep",
  ore: "ore"
};
export const TileType = {
  ...Resource,
  desert: "desert"
};
export const GameActionType = {
  buildRoad: "buildRoad",
  buildTown: "buildTown",
  rollDice: "rollDice",
  buildBuyTrade: "buildBuyTrade"
};
function getResource() {
  const resources = [
    Resource.brick,
    Resource.grain,
    Resource.ore,
    Resource.sheep,
    Resource.wood
  ];
  return resources[utils.randomNumber(resources.length)];
}
export function getCost(type) {
  return gameConfig().resourceCost[type];
}
export function getSquareBoard(rows, columns) {
  const tiles = [];
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      tiles.push({
        position: axial.offsetToAxial({row: x, col: y}),
        resource: getResource(),
        number: utils.randomNumber(12) + 1
      });
    }
  }
  return tiles;
}
export function getHexagonBoard(size) {
  const positions = gameConfig().hexagonPositions;
  return positions[size].map((p) => ({
    position: p,
    resource: p.q === 0 && p.r === 0 ? TileType.desert : getResource(),
    number: p.q === 0 && p.r === 0 ? void 0 : utils.randomNumber(12) + 1
  }));
}
function getId(type, position2) {
  return `${type}_${position2.map((pos) => `${pos.q}|${pos.r}`)}`;
}
function initialisePlayers(friends) {
  const colors = ["green", "red", "yellow", "blue"];
  const players = {};
  friends.forEach((friend, i) => {
    players[friend.id] = {
      ...friend,
      color: colors[i],
      resources: {brick: 0, grain: 0, ore: 0, sheep: 0, wood: 0}
    };
  });
  return players;
}
function generateStartingPhaseSequence(playerIds) {
  const sequence = [];
  for (const playerId of playerIds) {
    sequence.push({type: "buildTown", playerId});
    sequence.push({type: "buildRoad", playerId});
  }
  for (const playerId of [...playerIds].reverse()) {
    sequence.push({type: "buildTown", playerId});
    sequence.push({type: "buildRoad", playerId});
  }
  return sequence;
}
export function initialiseGame(boardSettings, friends) {
  const tiles = boardSettings.type === "hex" ? getHexagonBoard(boardSettings.size) : getSquareBoard(boardSettings.rows, boardSettings.columns);
  const tMap = tileMap.fromArray(tiles);
  const playerOrder = friends.map((f) => f.id);
  return {
    tiles: tMap,
    roads: [],
    towns: [],
    playerOrder,
    currentDiceRoll: [],
    players: initialisePlayers(friends),
    sequence: {
      phaseType: "setStartingTowns",
      scheduledActions: generateStartingPhaseSequence(playerOrder)
    }
  };
}
export function endTurn(state) {
  const currentAction = state.sequence.scheduledActions[0];
  const nextPlayer = state.playerOrder[(state.playerOrder.indexOf(currentAction.playerId) + 1) % state.playerOrder.length];
  state.sequence.scheduledActions = [{type: "rollDice", playerId: nextPlayer}];
}
export function rollDice(state) {
  const diceResult1 = utils.randomNumber(5) + 1;
  const diceResult2 = utils.randomNumber(5) + 1;
  const newResources = [];
  for (const tile of Object.values(state.tiles)) {
    if (tile.resource !== "desert" && tile.number === diceResult1 + diceResult2) {
      const townsOnTile = board.getTownsOnTile(tile.position, state.towns);
      for (const town of townsOnTile) {
        if (town.owner) {
          state.players[town.owner].resources[tile.resource] += 1;
          newResources.push({resource: tile.resource, playerId: town.owner});
        }
      }
    }
  }
  state.currentDiceRoll = [diceResult1, diceResult2];
  state.sequence.scheduledActions = [
    {
      type: "buildBuyTrade",
      playerId: state.sequence.scheduledActions[0].playerId
    }
  ];
}
export function getAllowedUiActions(currentGameAction) {
  switch (currentGameAction.type) {
    case GameActionType.buildRoad:
      return ["buildRoad"];
    case GameActionType.buildTown:
      return ["buildTown"];
    case GameActionType.rollDice:
      return ["rollDice"];
    case GameActionType.buildBuyTrade:
      return ["buildTown", "buildRoad", "endTurn"];
    default: {
      const exhaustiveCheck = currentGameAction.type;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
}
function payResources(state, playerId, resources) {
  const playerResources = state.players[playerId].resources;
  for (const resourceType of Object.keys(resources)) {
    playerResources[resourceType] -= resources[resourceType];
  }
}
function finishAction(state, type) {
  const currentAction = state.sequence.scheduledActions[0];
  if (currentAction.type === type) {
    state.sequence.scheduledActions.shift();
    if (state.sequence.phaseType === "setStartingTowns" && state.sequence.scheduledActions.length === 0) {
      for (const town of state.towns) {
        for (const coordinate of town.position) {
          const tile = board.findTile(state.tiles, coordinate);
          if (tile && tile.resource !== "desert") {
            state.players[town.owner].resources[tile.resource] += 1;
          }
        }
      }
      state.sequence.phaseType = "normal";
      state.sequence.scheduledActions = [
        {type: "rollDice", playerId: currentAction.playerId}
      ];
    }
  }
}
export function buildTown(state, position2) {
  const currentPlayerId = state.sequence.scheduledActions[0].playerId;
  if (!board.townPositionIs2RoadsApart(state.towns, position2)) {
    return;
  }
  if (state.sequence.phaseType === "normal" && !board.townPositionConnectsToExistingRoad(state.roads, position2, currentPlayerId)) {
    return;
  }
  if (state.sequence.phaseType === "normal") {
    payResources(state, currentPlayerId, getCost("town"));
  }
  state.towns.push({
    id: getId("town", position2),
    position: position2,
    owner: currentPlayerId
  });
  finishAction(state, GameActionType.buildTown);
}
export function buildRoad(state, position2) {
  if (state.sequence.phaseType === "normal" && !board.roadPositionConnectsToExistingRoad(state.roads, position2, state.sequence.scheduledActions[0].playerId)) {
    return;
  }
  if (state.sequence.phaseType === "normal") {
    payResources(state, state.sequence.scheduledActions[0].playerId, getCost("road"));
  }
  state.roads.push({
    id: getId("road", position2),
    position: position2,
    owner: state.sequence.scheduledActions[0].playerId
  });
  finishAction(state, GameActionType.buildRoad);
}
