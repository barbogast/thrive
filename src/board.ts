import * as hexUtils from './hexUtils'
import * as tileMap from './tileMap'
import * as game from './game'

export type RoadPosition = [hexUtils.AxialPosition, hexUtils.AxialPosition]

export type TownPosition = [
  hexUtils.AxialPosition,
  hexUtils.AxialPosition,
  hexUtils.AxialPosition,
]

export function getRoadPositions(tiles: tileMap.TileMap): RoadPosition[] {
  /*
    For every tile we add roads in directions 1, 2 and 3
    For the ones which lack neighours 4, 5 or 6 we add those as well.
    This should give us each road position exactly once */
  const roads: RoadPosition[] = []
  for (const tile of Object.values(tiles)) {
    for (const direction of [0, 1, 2] as hexUtils.Direction[]) {
      const neighborPos = hexUtils.getNeighbor(tile.position, direction)

      const road: RoadPosition = [tile.position, neighborPos]
      roads.push(road)
    }
    for (const direction of [3, 4, 5] as hexUtils.Direction[]) {
      const neighbourPos = hexUtils.getNeighbor(tile.position, direction)
      if (!tileMap.findInPos(tiles, neighbourPos)) {
        const road: RoadPosition = [tile.position, neighbourPos]
        roads.push(road)
      }
    }
  }
  return roads
}

function townIsEqual(town1: TownPosition, town2: TownPosition) {
  for (const pos of town1) {
    if (!town2.find((p) => p.q === pos.q && p.r === pos.r)) {
      return false
    }
  }
  return true
}

function findTown(towns: TownPosition[], searchFor: TownPosition) {
  for (const town of towns) {
    if (townIsEqual(town, searchFor)) {
      return true
    }
  }
  return false
}

export function getTownPositions(tiles: tileMap.TileMap): TownPosition[] {
  /*
    Approach is different than the one for roads:
    For each tile go through all 6 connecting positions and store the ones
    that are not already present */
  const towns: TownPosition[] = []
  for (const tile of Object.values(tiles)) {
    for (const direction of [0, 1, 2, 3, 4, 5] as hexUtils.Direction[]) {
      const neighborPos1 = hexUtils.getNeighbor(tile.position, direction)

      const neighborPos2 = hexUtils.getNeighbor(
        tile.position,
        ((direction + 1) % 6) as hexUtils.Direction,
      )

      const town: TownPosition = [tile.position, neighborPos1, neighborPos2]

      if (!findTown(towns, town)) {
        towns.push(town)
      }
    }
  }

  return towns
}

export function getTownsOnTile(
  tilePosition: hexUtils.AxialPosition,
  towns: game.Town[],
): game.Town[] {
  const townsOnTile = []
  for (const town of towns) {
    if (
      town.position.find(
        (pos) => pos.q === tilePosition.q && pos.r === tilePosition.r,
      )
    ) {
      townsOnTile.push(town)
    }
  }
  return townsOnTile
}
