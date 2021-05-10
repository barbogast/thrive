import * as hexUtils from './hexUtils'
import * as tileMap from './tileMap'
import * as game from './game'

export function getRoadPositions(tiles: tileMap.TileMap): game.Road[] {
  /*
    For every tile we add roads in directions 1, 2 and 3
    For the ones which lack neighours 4, 5 or 6 we add those as well.
    This should give us each road position exactly once */
  const roads: game.Road[] = []
  for (const tile of Object.values(tiles)) {
    const axialPos = hexUtils.offsetToAxial(tile.position)

    for (const direction of [0, 1, 2] as hexUtils.Direction[]) {
      const neighborPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
      const road: game.Road = {
        tiles: [tile.position, neighborPos],
      }
      roads.push(road)
    }
    for (const direction of [3, 4, 5] as hexUtils.Direction[]) {
      const neighbourPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
      if (!tileMap.findInPos(tiles, neighbourPos)) {
        const road: game.Road = {
          tiles: [tile.position, neighbourPos],
        }
        roads.push(road)
      }
    }
  }
  return roads
}

function townIsEqual(town1: game.Town, town2: game.Town) {
  for (const pos of town1.tiles) {
    if (!town2.tiles.find((p) => p.col === pos.col && p.row === pos.row)) {
      return false
    }
  }
  return true
}

function findTown(towns: game.Town[], searchFor: game.Town) {
  for (const town of towns) {
    if (townIsEqual(town, searchFor)) {
      return true
    }
  }
  return false
}

export function getTownPositions(tiles: tileMap.TileMap): game.Town[] {
  /*
    Approach is different than the one for roads:
    For each tile go through all 6 connecting positions and store the ones
    that are not already present */
  const towns: game.Town[] = []
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
      const town: game.Town = {
        tiles: [tile.position, neighborPos1, neighborPos2],
      }

      if (!findTown(towns, town)) {
        towns.push(town)
      }
    }
  }

  return towns
}
