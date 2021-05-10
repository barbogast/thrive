import * as hexUtils from './hexUtils'
import * as tileMap from './tileMap'
import * as board from './board'

export type Tile = {
  position: hexUtils.OffsetPosition
  color: string
}

export type Road = {
  position: board.RoadPosition
}

export type Town = {
  position: board.TownPosition
}

export type GameState = {
  tiles: tileMap.TileMap
  roads: Road[]
  towns: Town[]
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

export function initialiseGame(): GameState {
  const tiles = getHexagonBoard('3')
  const tMap = tileMap.fromArray(tiles)
  const roadPositions = board.getRoadPositions(tMap)
  const townPositions = board.getTownPositions(tMap)

  return {
    tiles: tMap,
    roads: roadPositions.map((position) => ({ position })),
    towns: townPositions.map((position) => ({ position })),
  }
}
