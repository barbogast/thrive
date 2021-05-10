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

export const Resource = {
  grain: 'grain',
  wood: 'wood',
  brick: 'brick',
  sheep: 'sheep',
  ore: 'ore',
} as const
type Resource = typeof Resource[keyof typeof Resource]

export const TileType = {
  ...Resource,
  desert: 'desert',
} as const
export type TileType = typeof TileType[keyof typeof TileType]

type Player = {
  id: PlayerId
  color: string
  resources: { [key in Resource]: number }
}

export type Tile = {
  position: hexUtils.OffsetPosition
  resource: TileType
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
  currentDiceRoll: [number, number] | []
  players: Player[]
}

function getResource() {
  const resources = [
    Resource.brick,
    Resource.grain,
    Resource.ore,
    Resource.sheep,
    Resource.wood,
  ]
  return resources[utils.randomNumber(resources.length)]
}

export function getSquareBoard(): Tile[] {
  const tiles = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tiles.push({
        position: { row: x, col: y },
        resource: getResource(),
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
    resource: p.q === 0 && p.r === 0 ? TileType.desert : getResource(),
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
    currentDiceRoll: [],
    players: [
      {
        id: PlayerId.green,
        color: 'green',
        resources: { brick: 0, grain: 0, ore: 0, sheep: 0, wood: 0 },
      },
      {
        id: PlayerId.red,
        color: 'red',
        resources: { brick: 0, grain: 0, ore: 0, sheep: 0, wood: 0 },
      },
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

export function rollDice(state: GameState) {
  // Roll with 2 dices
  const diceResult1 = utils.randomNumber(5) + 1
  const diceResult2 = utils.randomNumber(5) + 1

  const newResources: { playerId: PlayerId; resource: Resource }[] = []

  for (const tile of Object.values(state.tiles)) {
    if (
      tile.resource !== 'desert' &&
      tile.number === diceResult1 + diceResult2
    ) {
      const townsOnTile = board.getTownsOnTile(tile.position, state.towns)
      for (const town of townsOnTile) {
        if (town.owner) {
          state.players.find((p) => p.id === town.owner)!.resources[
            tile.resource
          ] += 1
          newResources.push({ resource: tile.resource, playerId: town.owner })
        }
      }
    }
  }

  state.currentDiceRoll = [diceResult1, diceResult2]
}
