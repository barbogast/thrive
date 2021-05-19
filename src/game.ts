import * as axial from './axial'
import * as tileMap from './tileMap'
import * as board from './board'
import * as utils from './utils'
import * as position from './position'
import { gameConfig } from './constants'

export type PlayerId = string

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
  id: string
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
  playerOrder: PlayerId[]
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
  return positions[size].map((p: axial.Coordinate) => ({
    position: p,
    resource: p.q === 0 && p.r === 0 ? TileType.desert : getResource(),
    number: p.q === 0 && p.r === 0 ? undefined : utils.randomNumber(12) + 1,
  }))
}

function getId(type: string, position: axial.Coordinate[]) {
  return `${type}_${position.map((pos) => `${pos.q}|${pos.r}`)}`
}

function initialisePlayers(playerIds: string[]) {
  const colors = ['green', 'red', 'yellow', 'blue']
  const players: { [key in PlayerId]: Player } = {}
  playerIds.forEach((id, i) => {
    players[id] = {
      id,
      color: colors[i],
      resources: { brick: 10, grain: 10, ore: 10, sheep: 10, wood: 10 },
    }
  })
  return players
}

export function initialiseGame(playerIds: string[]): GameState {
  const tiles = getHexagonBoard('3')
  const tMap = tileMap.fromArray(tiles)

  return {
    tiles: tMap,
    roads: [],
    towns: [],
    currentPlayer: playerIds[0],
    playerOrder: playerIds,
    currentDiceRoll: [],
    players: initialisePlayers(playerIds),
  }
}

export function getNextPlayer(state: GameState): void {
  state.currentPlayer =
    state.playerOrder[(state.playerOrder.indexOf(state.currentPlayer) + 1) % 4]
}

export function rollDice(state: GameState): void {
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

export function buildTown(state: GameState, position: position.Position): void {
  payResources(state, state.currentPlayer, getCost('town'))
  state.towns.push({
    id: getId('town', position),
    position,
    owner: state.currentPlayer,
  })
}

export function buildRoad(state: GameState, position: position.Position): void {
  console.log(
    board.roadPositionConnectsToExistingRoad(
      state.roads,
      position,
      state.currentPlayer,
    ),
  )

  payResources(state, state.currentPlayer, getCost('road'))
  state.roads.push({
    id: getId('road', position),
    position,
    owner: state.currentPlayer,
  })
}
