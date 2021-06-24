import React, { useEffect, useMemo } from 'react'
import { Layer } from 'react-konva'

import * as routing from '../lib/routing'
import * as board from '../lib/board'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'
import { useCurrentGame, useGameStore } from '../state/gameState'
import { useLocalStore } from '../state/localState'
import { useTempStore, UiActionType } from '../state/tempState'
import { sendState } from '../lib/peers'
import { visualConfig } from '../lib/constants'

const Board: React.FC = function Board() {
  const gameId = routing.useGameId()
  const { myId } = useLocalStore((state) => ({
    myId: state.myId,
  }))
  const tempStore = useTempStore((state) => ({
    uiAction: state.currentAction,
  }))
  const gameStore = useCurrentGame((game) => ({
    roads: game.roads,
    towns: game.towns,
    tiles: game.tiles,
    sequenceAction: game.sequence.scheduledActions[0],
    players: game.players,
  }))

  const isLocalPlayer =
    gameStore.players[gameStore.sequenceAction.playerId].peerId === myId

  const buildRoad =
    isLocalPlayer &&
    (tempStore.uiAction.type === UiActionType.buildRoad ||
      gameStore.sequenceAction.type === 'buildRoad')
  const buildShip =
    isLocalPlayer &&
    (tempStore.uiAction.type === UiActionType.buildShip ||
      gameStore.sequenceAction.type === 'buildShip')
  const buildTown =
    isLocalPlayer &&
    (tempStore.uiAction.type === UiActionType.buildTown ||
      gameStore.sequenceAction.type === 'buildTown')

  const positions = useMemo(() => {
    if (buildRoad) {
      return board.getRoadPositions(gameStore.tiles, true)
    } else if (buildShip) {
      return board.getRoadPositions(gameStore.tiles, false)
    } else if (buildTown) {
      return board.getTownPositions(gameStore.tiles)
    } else {
      return []
    }
  }, [gameStore.tiles, buildRoad, buildShip, buildTown])

  useEffect(() => {
    return useGameStore.subscribe((newState, oldState) => {
      const currentGame = oldState.games[gameId]
      const recentAction = currentGame.sequence.scheduledActions[0]
      const isLocalPlayer =
        currentGame.players[recentAction.playerId].peerId === myId
      if (isLocalPlayer) sendState(gameId)
    })
  }, [gameId, myId])

  return (
    <Layer>
      {Object.values(gameStore.tiles).map((t, i) => (
        <HexTile
          key={i}
          tile={t}
          radius={visualConfig().tileRadius}
          fontSize={14}
        />
      ))}

      {(buildRoad || buildShip) &&
        positions.map((r, i) => <Road key={i} position={r} />)}

      {buildTown &&
        positions.map((r, i) => <Town key={i} position={r} type="town" />)}

      {Object.values(gameStore.roads).map((r, i) => (
        <Road key={i} position={r.position} owner={r.owner} />
      ))}

      {Object.values(gameStore.towns).map((t, i) => (
        <Town key={i} position={t.position} owner={t.owner} type={t.type} />
      ))}
    </Layer>
  )
}

export default Board
