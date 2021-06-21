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

export function findTile(
  tiles: tileMap.TileMap,
  coord: axial.Coordinate,
): game.Tile | void {
  return Object.values(tiles).find((t) =>
    axial.compareCoordinates(t.position, coord),
  )
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

export function townPositionConnectsToExistingRoad(
  roads: game.Road[],
  townPosition: position.Position,
  playerId: game.PlayerId,
): boolean {
  const [tileA, tileB, tileC] = townPosition
  const possibleRoads = [
    position.createPosition([tileA, tileB]),
    position.createPosition([tileA, tileC]),
    position.createPosition([tileB, tileC]),
  ]
  for (const roadPosition of possibleRoads) {
    const maybeRoad = findRoad(roads, roadPosition)
    if (maybeRoad && maybeRoad.owner === playerId) {
      return true
    }
  }

  return false
}

export function roadPositionConnectsToExistingRoad(
  roads: game.Road[],
  roadPosition: position.Position,
  playerId: game.PlayerId,
): boolean {
  const [tileA, tileB] = roadPosition

  // Find all neighbors of both tiles the road touches
  const neighborsOfA = axial.allDirections.map((dir) =>
    axial.getNeighbor(tileA, dir),
  )
  const neighborsOfB = axial.allDirections.map((dir) =>
    axial.getNeighbor(tileB, dir),
  )

  // Remember the neighbors which touch both tiles
  const neighborsOfBoth = neighborsOfA.filter((tA) =>
    neighborsOfB.find((tB) => axial.compareCoordinates(tA, tB)),
  )
  utils.assert(() => neighborsOfBoth.length === 2)

  // Generate the townPositions on both ends of the road
  const townPos1 = position.createPosition([tileA, tileB, neighborsOfBoth[0]])
  const townPos2 = position.createPosition([tileA, tileB, neighborsOfBoth[1]])

  return (
    townPositionConnectsToExistingRoad(roads, townPos1, playerId) ||
    townPositionConnectsToExistingRoad(roads, townPos2, playerId)
  )
}

export function townPositionIs2RoadsApart(
  towns: game.Town[],
  townPosition: position.Position,
): boolean {
  const [tileA, tileB, tileC] = townPosition

  const collidingPositions = [
    position.createPosition([tileA, tileB]),
    position.createPosition([tileA, tileC]),
    position.createPosition([tileB, tileC]),
  ]

  for (const town of towns) {
    for (const collidingPos of collidingPositions) {
      if (position.comparePartialPosition(town.position, collidingPos)) {
        return false
      }
    }
  }

  return true
}

export function getDimensions(tiles: game.Tile[]): {
  top: number
  bottom: number
  left: number
  right: number
} {
  let top = 0,
    bottom = 0,
    left = 0,
    right = 0
  for (const tile of tiles) {
    const offsetPos = axial.axialToOffset(tile.position)
    top = Math.min(top, offsetPos.col)
    bottom = Math.max(bottom, offsetPos.col)
    right = Math.max(right, offsetPos.row)
    left = Math.min(left, offsetPos.row)
  }
  return { top, bottom, right, left }
}
