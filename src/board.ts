import * as hexUtils from './hexUtils'
import * as tileMap from './tileMap'

export type Tile = {
  position: hexUtils.OffsetPosition
  color: string
}

export type Road = {
  tiles: [hexUtils.OffsetPosition, hexUtils.OffsetPosition]
}

export type Town = {
  tiles: [
    hexUtils.OffsetPosition,
    hexUtils.OffsetPosition,
    hexUtils.OffsetPosition,
  ]
}

function getColor() {
  const colors = ['yellow', 'darkgreen', 'lightgreen', 'grey', '#873600']
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getSquareBoard(): Tile[] {
  const tiles = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tiles.push({ position: { row: x, col: y }, color: getColor() })
    }
  }
  return tiles
}

export function getHexagonBoard(size: '3' | '5'): Tile[] {
  const positions = {
    '3': [
      { q: -1, r: 0 },
      { q: -1, r: 1 },

      { q: 0, r: -1 },
      { q: 0, r: 0 },
      { q: 0, r: 1 },

      { q: 1, r: -1 },
      { q: 1, r: 0 },
    ],
    '5': [
      { q: -2, r: 0 },
      { q: -2, r: 1 },
      { q: -2, r: 2 },

      { q: -1, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: -1, r: 2 },

      { q: 0, r: -2 },
      { q: 0, r: -1 },
      { q: 0, r: 0 },
      { q: 0, r: 1 },
      { q: 0, r: 2 },

      { q: 1, r: -2 },
      { q: 1, r: -1 },
      { q: 1, r: 0 },
      { q: 1, r: 1 },

      { q: 2, r: -2 },
      { q: 2, r: -1 },
      { q: 2, r: 0 },
    ],
  }

  return positions[size].map((p) => ({
    position: hexUtils.axialToOffset(p),
    color: p.q === 0 && p.r === 0 ? 'lightyellow' : getColor(),
  }))
}

export function getRoadPositions(tiles: tileMap.TileMap): Road[] {
  /*
    For every tile we add roads in directions 1, 2 and 3
    For the ones which lack neighours 4, 5 or 6 we add those as well.
    This should give us each road position exactly once */
  const roads: Road[] = []
  for (const tile of Object.values(tiles)) {
    const axialPos = hexUtils.offsetToAxial(tile.position)

    for (const direction of [0, 1, 2] as hexUtils.Direction[]) {
      const neighborPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
      const road: Road = {
        tiles: [tile.position, neighborPos],
      }
      roads.push(road)
    }
    for (const direction of [3, 4, 5] as hexUtils.Direction[]) {
      const neighbourPos = hexUtils.axialToOffset(
        hexUtils.getNeighbor(axialPos, direction),
      )
      if (!tileMap.findInPos(tiles, neighbourPos)) {
        const road: Road = {
          tiles: [tile.position, neighbourPos],
        }
        roads.push(road)
      }
    }
  }
  return roads
}

function townIsEqual(town1: Town, town2: Town) {
  for (const pos of town1.tiles) {
    if (!town2.tiles.find((p) => p.col === pos.col && p.row === pos.row)) {
      return false
    }
  }
  return true
}

function findTown(towns: Town[], searchFor: Town) {
  for (const town of towns) {
    if (townIsEqual(town, searchFor)) {
      return true
    }
  }
  return false
}

export function getTownPositions(tiles: tileMap.TileMap): Town[] {
  /*
    Approach is different than the one for roads:
    For each tile go through all 6 connecting positions and store the ones
    that are not already present */
  const towns: Town[] = []
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
      const town: Town = {
        tiles: [tile.position, neighborPos1, neighborPos2],
      }

      if (!findTown(towns, town)) {
        towns.push(town)
      }
    }
  }

  return towns
}
