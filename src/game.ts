import * as axial from './axial'
import * as tileMap from './tileMap'
import * as board from './board'
import * as utils from './utils'
import * as position from './position'
import { gameConfig } from './constants'
import { UiActionType } from './state'

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

export const GameActionType = {
  buildRoad: 'buildRoad',
  buildTown: 'buildTown',
  rollDice: 'rollDice',
  buildBuyTrade: 'buildBuyTrade',
} as const
export type GameActionType = typeof GameActionType[keyof typeof GameActionType]

export type GameAction = {
  type: GameActionType
  playerId: string
}

export type GameState = {
  tiles: tileMap.TileMap
  roads: Road[]
  towns: Town[]
  playerOrder: PlayerId[]
  currentDiceRoll: [number, number] | []
  players: { [key in PlayerId]: Player }
  sequence: {
    phaseType: 'setStartingTowns' | 'normal'
    scheduledActions: GameAction[]
  }
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

function generateStartingPhaseSequence(playerIds: string[]) {
  const sequence = []

  // First town + road
  for (const playerId of playerIds) {
    sequence.push({ type: 'buildTown', playerId } as const)
    sequence.push({ type: 'buildRoad', playerId } as const)
  }

  // Second town + road with inverted player order
  for (const playerId of [...playerIds].reverse()) {
    sequence.push({ type: 'buildTown', playerId } as const)
    sequence.push({ type: 'buildRoad', playerId } as const)
  }

  return sequence
}

export function initialiseGame(playerIds: string[]): GameState {
  const tiles = getHexagonBoard('3')
  const tMap = tileMap.fromArray(tiles)

  return {
    tiles: tMap,
    roads: [],
    towns: [],
    playerOrder: playerIds,
    currentDiceRoll: [],
    players: initialisePlayers(playerIds),
    sequence: {
      phaseType: 'setStartingTowns',
      scheduledActions: generateStartingPhaseSequence(playerIds),
    },
  }
}

export function endTurn(state: GameState): void {
  const currentAction = state.sequence.scheduledActions[0]
  const nextPlayer =
    state.playerOrder[
      (state.playerOrder.indexOf(currentAction.playerId) + 1) %
        state.playerOrder.length
    ]
  state.sequence.scheduledActions = [{ type: 'rollDice', playerId: nextPlayer }]
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
  state.sequence.scheduledActions = [
    {
      type: 'buildBuyTrade',
      playerId: state.sequence.scheduledActions[0].playerId,
    },
  ]
}

export function getAllowedUiActions(
  currentGameAction: GameAction,
): UiActionType[] {
  switch (currentGameAction.type) {
    case GameActionType.buildRoad:
      return ['buildRoad']
    case GameActionType.buildTown:
      return ['buildTown']
    case GameActionType.rollDice:
      return ['rollDice']
    case GameActionType.buildBuyTrade:
      return ['buildTown', 'buildRoad', 'endTurn']
    default: {
      const exhaustiveCheck: never = currentGameAction.type
      throw new Error(`Unhandled case: ${exhaustiveCheck}`)
    }
  }
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

function finishAction(state: GameState, type: GameActionType) {
  const currentAction = state.sequence.scheduledActions[0]
  if (currentAction.type === type) {
    state.sequence.scheduledActions.shift()
    if (
      state.sequence.phaseType === 'setStartingTowns' &&
      state.sequence.scheduledActions.length === 0
    ) {
      state.sequence.phaseType = 'normal'
      state.sequence.scheduledActions = [
        { type: 'rollDice', playerId: currentAction.playerId },
      ]
    }
  }
}

export function buildTown(state: GameState, position: position.Position): void {
  const currentPlayerId = state.sequence.scheduledActions[0].playerId
  if (!board.townPositionIs2RoadsApart(state.towns, position)) {
    return
  }

  if (
    state.sequence.phaseType === 'normal' &&
    !board.townPositionConnectsToExistingRoad(
      state.roads,
      position,
      currentPlayerId,
    )
  ) {
    return
  }

  if (state.sequence.phaseType === 'normal') {
    payResources(state, currentPlayerId, getCost('town'))
  }
  state.towns.push({
    id: getId('town', position),
    position,
    owner: currentPlayerId,
  })
  finishAction(state, GameActionType.buildTown)
}

export function buildRoad(state: GameState, position: position.Position): void {
  if (
    state.sequence.phaseType === 'normal' &&
    !board.roadPositionConnectsToExistingRoad(
      state.roads,
      position,
      state.sequence.scheduledActions[0].playerId,
    )
  ) {
    return
  }

  if (state.sequence.phaseType === 'normal') {
    payResources(
      state,
      state.sequence.scheduledActions[0].playerId,
      getCost('road'),
    )
  }
  state.roads.push({
    id: getId('road', position),
    position,
    owner: state.sequence.scheduledActions[0].playerId,
  })
  finishAction(state, GameActionType.buildRoad)
}
