import * as axial from "./axial.js";
import * as tileMap from "./tileMap.js";
import * as utils from "./utils.js";
import * as position from "./position.js";
export function getRoadPositions(tiles) {
  const roads = [];
  for (const tile of Object.values(tiles)) {
    for (const direction of [0, 1, 2]) {
      const neighborPos = axial.getNeighbor(tile.position, direction);
      const road = position.createPosition([tile.position, neighborPos]);
      roads.push(road);
    }
    for (const direction of [3, 4, 5]) {
      const neighbourPos = axial.getNeighbor(tile.position, direction);
      if (!tileMap.findInPos(tiles, neighbourPos)) {
        const road = position.createPosition([tile.position, neighbourPos]);
        roads.push(road);
      }
    }
  }
  return roads;
}
function findTownPosition(towns, searchFor) {
  for (const town of towns) {
    if (position.comparePositions(town, searchFor)) {
      return true;
    }
  }
  return false;
}
function townIsOnTile(town, tilePosition) {
  return Boolean(town.position.find((pos) => axial.compareCoordinates(pos, tilePosition)));
}
export function getTownPositions(tiles) {
  const towns = [];
  for (const tile of Object.values(tiles)) {
    for (const direction of axial.allDirections) {
      const neighborPos1 = axial.getNeighbor(tile.position, direction);
      const neighborPos2 = axial.getNeighbor(tile.position, (direction + 1) % 6);
      const town = position.createPosition([
        tile.position,
        neighborPos1,
        neighborPos2
      ]);
      if (!findTownPosition(towns, town)) {
        towns.push(town);
      }
    }
  }
  return towns;
}
export function getTownsOnTile(tilePosition, towns) {
  const townsOnTile = [];
  for (const town of towns) {
    if (townIsOnTile(town, tilePosition)) {
      townsOnTile.push(town);
    }
  }
  return townsOnTile;
}
export function findTile(tiles, coord) {
  return Object.values(tiles).find((t) => axial.compareCoordinates(t.position, coord));
}
export function findRoad(roads, roadPosition) {
  for (const road of roads) {
    if (position.comparePositions(road.position, roadPosition)) {
      return road;
    }
  }
}
export function townPositionConnectsToExistingRoad(roads, townPosition, playerId) {
  const [tileA, tileB, tileC] = townPosition;
  const possibleRoads = [
    position.createPosition([tileA, tileB]),
    position.createPosition([tileA, tileC]),
    position.createPosition([tileB, tileC])
  ];
  for (const roadPosition of possibleRoads) {
    const maybeRoad = findRoad(roads, roadPosition);
    if (maybeRoad && maybeRoad.owner === playerId) {
      return true;
    }
  }
  return false;
}
export function roadPositionConnectsToExistingRoad(roads, roadPosition, playerId) {
  const [tileA, tileB] = roadPosition;
  const neighborsOfA = axial.allDirections.map((dir) => axial.getNeighbor(tileA, dir));
  const neighborsOfB = axial.allDirections.map((dir) => axial.getNeighbor(tileB, dir));
  const neighborsOfBoth = neighborsOfA.filter((tA) => neighborsOfB.find((tB) => axial.compareCoordinates(tA, tB)));
  utils.assert(() => neighborsOfBoth.length === 2);
  const townPos1 = position.createPosition([tileA, tileB, neighborsOfBoth[0]]);
  const townPos2 = position.createPosition([tileA, tileB, neighborsOfBoth[1]]);
  return townPositionConnectsToExistingRoad(roads, townPos1, playerId) || townPositionConnectsToExistingRoad(roads, townPos2, playerId);
}
export function townPositionIs2RoadsApart(towns, townPosition) {
  const [tileA, tileB, tileC] = townPosition;
  const collidingPositions = [
    position.createPosition([tileA, tileB]),
    position.createPosition([tileA, tileC]),
    position.createPosition([tileB, tileC])
  ];
  for (const town of towns) {
    for (const collidingPos of collidingPositions) {
      if (position.comparePartialPosition(town.position, collidingPos)) {
        return false;
      }
    }
  }
  return true;
}
