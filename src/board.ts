import * as hexUtils from './hexUtils'
import * as tileMap from './tileMap'

export type RoadPosition = [hexUtils.OffsetPosition, hexUtils.OffsetPosition]

export type TownPosition = [
  hexUtils.OffsetPosition,
  hexUtils.OffsetPosition,
  hexUtils.OffsetPosition,
]

export function getRoadPositions(tiles: tileMap.TileMap): RoadPosition[] {
  /*
    For every tile we add roads in directions 1, 2 and 3
    For the ones which lack neighours 4, 5 or 6 we add those as well.
    This should give us each road position exactly once */
  const roads: RoadPosition[] = []
  for (const tile of Object.values(tiles)) {
    const axialPos = hexUtils.offsetToAxial(tile.position)

    for (const direction of [0, 1, 2] as hexUtils.Direction[]) {
      const neighborPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
      const road: RoadPosition = [tile.position, neighborPos]
      roads.push(road)
    }
    for (const direction of [3, 4, 5] as hexUtils.Direction[]) {
      const neighbourPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
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
    if (!town2.find((p) => p.col === pos.col && p.row === pos.row)) {
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
    const axialPos = hexUtils.offsetToAxial(tile.position)

    for (const direction of [0, 1, 2, 3, 4, 5] as hexUtils.Direction[]) {
      const neighborPos1 = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )

      const neighborPos2 = hexUtils.axialToOffset(
        hexUtils.getNeighbor(
          axialPos,
          ((direction + 1) % 6) as hexUtils.Direction,
        ),
      )
      const town: TownPosition = [tile.position, neighborPos1, neighborPos2]

      if (!findTown(towns, town)) {
        towns.push(town)
      }
    }
  }

  return towns
}
