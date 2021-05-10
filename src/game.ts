import * as hexUtils from './hexUtils'
import * as tileMap from './tileMap'
import * as board from './board'
import * as utils from './utils'

export enum PlayerId {
  green = 'green',
  red = 'red',
  yellow = 'yellow',
  blue = 'blue',
}

type Player = {
  id: PlayerId
  color: string
}

export type Tile = {
  position: hexUtils.OffsetPosition
  color: string
  number: number | void
}

export type Road = {
  id: string
  position: board.RoadPosition
  owner: PlayerId | void
}

export type Town = {
  id: string
  position: board.TownPosition
  owner: PlayerId | void
}

export type GameState = {
  tiles: tileMap.TileMap
  roads: Road[]
  towns: Town[]
  currentPlayer: PlayerId
  players: Player[]
}

function getColor() {
  const colors = ['yellow', 'darkgreen', 'lightgreen', 'grey', '#873600']
  return colors[utils.randomNumber(colors.length)]
}

export function getSquareBoard(): Tile[] {
  const tiles = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tiles.push({
        position: { row: x, col: y },
        color: getColor(),
        number: utils.randomNumber(12) + 1,
      })
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
    number: p.q === 0 && p.r === 0 ? undefined : utils.randomNumber(12) + 1,
  }))
}

function getId(type: string, position: hexUtils.OffsetPosition[]) {
  return `${type}_${position.map((pos) => `${pos.row}|${pos.col}`)}`
}

export function initialiseGame(): GameState {
  const tiles = getHexagonBoard('3')
  const tMap = tileMap.fromArray(tiles)
  const roadPositions = board.getRoadPositions(tMap)
  const townPositions = board.getTownPositions(tMap)

  return {
    tiles: tMap,
    roads: roadPositions.map((position) => ({
      position,
      owner: undefined,
      id: getId('road', position),
    })),
    towns: townPositions.map((position) => ({
      position,
      owner: undefined,
      id: getId('road', position),
    })),
    currentPlayer: PlayerId.green,
    players: [
      { id: PlayerId.green, color: 'green' },
      { id: PlayerId.red, color: 'red' },
    ],
  }
}

const playerOrder: PlayerId[] = [
  PlayerId.green,
  PlayerId.red,
  PlayerId.yellow,
  PlayerId.blue,
]
export function getNextPlayer(currentPlayer: PlayerId): PlayerId {
  return playerOrder[(playerOrder.indexOf(currentPlayer) + 1) % 4]
}
