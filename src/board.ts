import * as axial from './axial'
import * as tileMap from './tileMap'
import * as game from './game'
import * as utils from './utils'
import * as position from './position'

export function getRoadPositions(tiles: tileMap.TileMap): position.Position[] {
  /*
    For every tile we add roads in directions 1, 2 and 3
    For the ones which lack neighours 4, 5 or 6 we add those as well.
    This should give us each road position exactly once */
  const roads: position.Position[] = []
  for (const tile of Object.values(tiles)) {
    for (const direction of [0, 1, 2] as axial.Direction[]) {
      const neighborPos = axial.getNeighbor(tile.position, direction)

      const road = position.createPosition([tile.position, neighborPos])
      roads.push(road)
    }
    for (const direction of [3, 4, 5] as axial.Direction[]) {
      const neighbourPos = axial.getNeighbor(tile.position, direction)
      if (!tileMap.findInPos(tiles, neighbourPos)) {
        const road = position.createPosition([tile.position, neighbourPos])
        roads.push(road)
      }
    }
  }
  return roads
}

function findTownPosition(
  towns: position.Position[],
  searchFor: position.Position,
) {
  for (const town of towns) {
    if (position.comparePositions(town, searchFor)) {
      return true
    }
  }
  return false
}

function townIsOnTile(
  town: game.Town,
  tilePosition: axial.Coordinate,
): boolean {
  return Boolean(
    town.position.find((pos) => axial.compareCoordinates(pos, tilePosition)),
  )
}

export function getTownPositions(tiles: tileMap.TileMap): position.Position[] {
  /*
    Approach is different than the one for roads:
    For each tile go through all 6 connecting positions and store the ones
    that are not already present */
  const towns: position.Position[] = []
  for (const tile of Object.values(tiles)) {
    for (const direction of axial.allDirections) {
      const neighborPos1 = axial.getNeighbor(tile.position, direction)

      const neighborPos2 = axial.getNeighbor(
        tile.position,
        ((direction + 1) % 6) as axial.Direction,
      )

      const town = position.createPosition([
        tile.position,
        neighborPos1,
        neighborPos2,
      ])

      if (!findTownPosition(towns, town)) {
        towns.push(town)
      }
    }
  }

  return towns
}

export function getTownsOnTile(
  tilePosition: axial.Coordinate,
  towns: game.Town[],
): game.Town[] {
  const townsOnTile = []
  for (const town of towns) {
    if (townIsOnTile(town, tilePosition)) {
      townsOnTile.push(town)
    }
  }
  return townsOnTile
}

export function findRoad(
  roads: game.Road[],
  roadPosition: position.Position,
): game.Road | void {
  for (const road of roads) {
    if (position.comparePositions(road.position, roadPosition)) {
      return road
    }
  }
}

export function roadPositionConnectsToExistingRoad(
  roads: game.Road[],
  roadPosition: position.Position,
  playerId: game.PlayerId,
): boolean {
  /*
  Building of the road is allowed if it connects to an existing road or town.
  The player wants to build the road between tiles A and B. To find existing roads
  which would connect we need to determine both tiles that neighbor tile A and B.
  We then have to look for roads which are between either neighboring tile and tile A or B.
  */
  const [tileA, tileB] = roadPosition

  const neighborsOfA = axial.allDirections.map((dir) =>
    axial.getNeighbor(tileA, dir),
  )
  const neighborsOfB = axial.allDirections.map((dir) =>
    axial.getNeighbor(tileB, dir),
  )

  const neighborsOfBoth = neighborsOfA.filter((tA) =>
    neighborsOfB.find((tB) => axial.compareCoordinates(tA, tB)),
  )

  utils.assert(() => neighborsOfBoth.length === 2)

  for (const neighboaringTile of neighborsOfBoth) {
    for (const tile of [tileA, tileB]) {
      const maybeRoad = findRoad(
        roads,
        position.createPosition([neighboaringTile, tile]),
      )
      if (maybeRoad && maybeRoad?.owner === playerId) {
        return true
      }
    }
  }

  return false
}
