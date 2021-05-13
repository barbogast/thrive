import * as axial from './axial'
import * as tileMap from './tileMap'
import * as board from './board'
import * as utils from './utils'
import * as position from './position'
import { gameConfig } from './constants'

export const PlayerId = {
  green: 'green',
  red: 'red',
  yellow: 'yellow',
  blue: 'blue',
}
export type PlayerId = typeof PlayerId[keyof typeof PlayerId]

export const Resource = {
  grain: 'grain',
  wood: 'wood',
  brick: 'brick',
  sheep: 'sheep',
  ore: 'ore',
} as const
type Resource = typeof Resource[keyof typeof Resource]

type Resources = { [key in Resource]: number }

export const TileType = {
  ...Resource,
  desert: 'desert',
} as const
export type TileType = typeof TileType[keyof typeof TileType]

type Player = {
  id: PlayerId
  color: string
  resources: Resources
}

export type Tile = {
  position: axial.Coordinate
  resource: TileType
  number: number | void
}

export type Road = {
  id: string
  position: position.Position
  owner: PlayerId
}

export type Town = {
  id: string
  position: position.Position
  owner: PlayerId
}

export type GameState = {
  tiles: tileMap.TileMap
  roads: Road[]
  towns: Town[]
  currentPlayer: PlayerId
  currentDiceRoll: [number, number] | []
  players: { [key in PlayerId]: Player }
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

export function getCost(type: 'town' | 'road'): Resources {
  return gameConfig().resourceCost[type]
}

export function getSquareBoard(): Tile[] {
  const tiles = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tiles.push({
        position: axial.offsetToAxial({ row: x, col: y }),
        resource: getResource(),
        number: utils.randomNumber(12) + 1,
      })
    }
  }
  return tiles
}

export function getHexagonBoard(size: '3' | '5'): Tile[] {
  const positions = gameConfig().hexagonPositions

  return positions[size].map((p) => ({
    position: p,
    resource: p.q === 0 && p.r === 0 ? TileType.desert : getResource(),
    number: p.q === 0 && p.r === 0 ? undefined : utils.randomNumber(12) + 1,
  }))
}

function getId(type: string, position: axial.Coordinate[]) {
  return `${type}_${position.map((pos) => `${pos.q}|${pos.r}`)}`
}

export function initialisePlayers() {
  return {
    [PlayerId.green]: {
      id: PlayerId.green,
      color: 'green',
      resources: { brick: 10, grain: 10, ore: 10, sheep: 10, wood: 10 },
    },
    [PlayerId.red]: {
      id: PlayerId.red,
      color: 'red',
      resources: { brick: 10, grain: 10, ore: 10, sheep: 10, wood: 10 },
    },
    [PlayerId.yellow]: {
      id: PlayerId.yellow,
      color: 'yellow',
      resources: { brick: 10, grain: 10, ore: 10, sheep: 10, wood: 10 },
    },
    [PlayerId.blue]: {
      id: PlayerId.blue,
      color: 'blue',
      resources: { brick: 10, grain: 10, ore: 10, sheep: 10, wood: 10 },
    },
  }
}

export function initialiseGame(): GameState {
  const tiles = getHexagonBoard('3')
  const tMap = tileMap.fromArray(tiles)
  const townPositions = board.getTownPositions(tMap)

  return {
    tiles: tMap,
    roads: [],
    towns: [],
    currentPlayer: PlayerId.green,
    currentDiceRoll: [],
    players: initialisePlayers(),
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
          state.players[town.owner].resources[tile.resource] += 1
          newResources.push({ resource: tile.resource, playerId: town.owner })
        }
      }
    }
  }

  state.currentDiceRoll = [diceResult1, diceResult2]
}

function payResources(
  state: GameState,
  playerId: PlayerId,
  resources: Resources,
) {
  const playerResources = state.players[playerId].resources
  for (const resourceType of Object.keys(resources)) {
    playerResources[resourceType as Resource] -=
      resources[resourceType as Resource]
  }
}

export function buildTown(state: GameState, position: position.Position) {
  if (board.findTown(state.towns, position)) {
    return
  }
  payResources(state, state.currentPlayer, getCost('town'))
  state.towns.push({
    id: getId('town', position),
    position,
    owner: state.currentPlayer,
  })
}

export function buildRoad(state: GameState, position: position.Position) {
  console.log(
    board.roadPositionConnectsToExistingRoad(
      state.roads,
      position,
      state.currentPlayer,
    ),
  )

  if (board.findRoad(state.roads, position)) {
    return
  }
  payResources(state, state.currentPlayer, getCost('road'))
  state.roads.push({
    id: getId('road', position),
    position,
    owner: state.currentPlayer,
  })
}
