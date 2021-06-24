import * as axial from './axial'
import * as tileMap from './tileMap'
import * as board from './board'
import * as utils from './utils'
import * as position from './position'
import { gameConfig } from './constants'
import { Friend } from '../state/localState'
import { UiActionType } from '../state/tempState'

export type PlayerId = string

type Player = Friend & {
  color: string
  resources: board.Resources
  points: number
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
  type: 'city' | 'town'
}

export const GameActionType = {
  buildRoad: 'buildRoad',
  buildTown: 'buildTown',
  buildCity: 'buildCity',
  rollDice: 'rollDice',
  buildBuyTrade: 'buildBuyTrade',
} as const
export type GameActionType = typeof GameActionType[keyof typeof GameActionType]

export type GameAction = {
  type: GameActionType
  playerId: string
}

export type Game = {
  gameId: string
  pointsForVictory: number | void
  winnerId: string | void
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

export function getCost(type: 'town' | 'city' | 'road'): board.Resources {
  return gameConfig().resourceCost[type]
}

function getId(type: string, position: axial.Coordinate[]) {
  return `${type}_${position.map((pos) => `${pos.q}|${pos.r}`)}`
}

function initialisePlayers(friends: Friend[]) {
  const colors = ['green', 'red', 'yellow', 'blue']
  const players: { [key in PlayerId]: Player } = {}
  friends.forEach((friend, i) => {
    players[friend.id] = {
      ...friend,
      color: colors[i],
      resources: { brick: 0, grain: 0, ore: 0, sheep: 0, wood: 0 },
      points: 0,
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

export function generateBoard(
  boardSettings: board.BoardSettings,
): board.Tile[] {
  return boardSettings.type === 'hex'
    ? board.getHexagonBoard(boardSettings.size)
    : board.getSquareBoard(boardSettings.rows, boardSettings.columns)
}

export function initialiseGame(
  gameId: string,
  tiles: board.Tile[],
  friends: Friend[],
  pointsForVictory: number | void,
): Game {
  const tMap = tileMap.fromArray(tiles)
  const playerOrder = friends.map((f) => f.id)

  return {
    gameId,
    winnerId: undefined,
    pointsForVictory,
    tiles: tMap,
    roads: [],
    towns: [],
    playerOrder,
    currentDiceRoll: [],
    players: initialisePlayers(friends),
    sequence: {
      phaseType: 'setStartingTowns',
      scheduledActions: generateStartingPhaseSequence(playerOrder),
    },
  }
}

function calculatePoints(state: Game, playerId: string): number {
  return state.towns
    .filter((town) => town.owner === playerId)
    .reduce((prev, town) => (prev + town.type === 'town' ? 1 : 2), 0)
}

export function endTurn(state: Game): void {
  for (const player of Object.values(state.players)) {
    player.points = calculatePoints(state, player.id)
    if (player.points >= state.pointsForVictory) {
      state.winnerId = player.id
    }
  }
  const currentAction = state.sequence.scheduledActions[0]
  const nextPlayer =
    state.playerOrder[
      (state.playerOrder.indexOf(currentAction.playerId) + 1) %
        state.playerOrder.length
    ]
  state.sequence.scheduledActions = [{ type: 'rollDice', playerId: nextPlayer }]
}

export function rollDice(state: Game): void {
  // Roll with 2 dices
  const diceResult1 = utils.randomNumber(5) + 1
  const diceResult2 = utils.randomNumber(5) + 1

  for (const tile of Object.values(state.tiles)) {
    if (
      board.tileIsResource(tile.type) &&
      tile.number === diceResult1 + diceResult2
    ) {
      const townsOnTile = board.getTownsOnTile(tile.position, state.towns)
      for (const town of townsOnTile) {
        if (town.owner) {
          state.players[town.owner].resources[tile.type] +=
            town.type === 'town' ? 1 : 2
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
    case GameActionType.buildCity:
      return ['buildCity']
    case GameActionType.rollDice:
      return ['rollDice']
    case GameActionType.buildBuyTrade:
      return ['buildTown', 'buildCity', 'buildRoad', 'endTurn']
    default: {
      const exhaustiveCheck: never = currentGameAction.type
      throw new Error(`Unhandled case: ${exhaustiveCheck}`)
    }
  }
}

function payResources(
  state: Game,
  playerId: PlayerId,
  resources: board.Resources,
) {
  const playerResources = state.players[playerId].resources
  for (const resourceType of utils.getKeys(resources)) {
    playerResources[resourceType] -= resources[resourceType]
  }
}

function finishAction(state: Game, type: GameActionType) {
  const currentAction = state.sequence.scheduledActions[0]
  if (currentAction.type === type) {
    state.sequence.scheduledActions.shift()
    if (
      state.sequence.phaseType === 'setStartingTowns' &&
      state.sequence.scheduledActions.length === 0
    ) {
      for (const town of state.towns) {
        for (const coordinate of town.position) {
          const tile = board.findTile(state.tiles, coordinate)
          if (tile && board.tileIsResource(tile.type)) {
            state.players[town.owner].resources[tile.type] += 1
          }
        }
      }
      state.sequence.phaseType = 'normal'
      state.sequence.scheduledActions = [
        { type: 'rollDice', playerId: currentAction.playerId },
      ]
    }
  }
}

export function buildTown(state: Game, position: position.Position): void {
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
    type: 'town',
  })
  state.players[currentPlayerId].points += 1
  finishAction(state, GameActionType.buildTown)
}

export function upgradeTown(state: Game, position: position.Position): void {
  const currentPlayerId = state.sequence.scheduledActions[0].playerId
  const town = board.findObject(state.towns, position)
  if (!town || town.type === 'city') {
    return
  }
  payResources(state, currentPlayerId, getCost('city'))
  town.type = 'city'
}

export function buildRoad(state: Game, position: position.Position): void {
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
