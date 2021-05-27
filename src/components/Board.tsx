import React, { useEffect, useMemo } from 'react'
import { Layer } from 'react-konva'

import { useStores } from '../state/useStores'
import { useLocalStore } from '../state/localState'
import * as routing from '../routing'
import * as board from '../board'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'
import { useCurrentGame, useGameStoreApi } from '../state/gameState'
import { sendState } from '../hooks/useConnection'
import { useTempStore, UiActionType } from '../state/tempState'

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
  }))
  const stores = useStores()

  const buildRoad =
    tempStore.uiAction.type === UiActionType.buildRoad ||
    gameStore.sequenceAction.type === 'buildRoad'
  const buildTown =
    tempStore.uiAction.type === UiActionType.buildTown ||
    gameStore.sequenceAction.type === 'buildTown'

  const positions = useMemo(() => {
    if (buildRoad) {
      return board.getRoadPositions(gameStore.tiles)
    } else if (buildTown) {
      return board.getTownPositions(gameStore.tiles)
    } else {
      return []
    }
  }, [gameStore.tiles, buildRoad, buildTown])

  const gameStoreApi = useGameStoreApi()
  useEffect(() => {
    return gameStoreApi.subscribe((newState, oldState) => {
      if (oldState.games[gameId].sequence.scheduledActions[0].playerId === myId)
        sendState(stores)(gameId)
    })
  }, [])

  return (
    <Layer>
      {Object.values(gameStore.tiles).map((t, i) => (
        <HexTile key={i} tile={t} />
      ))}

      {buildRoad && positions.map((r, i) => <Road key={i} position={r} />)}

      {buildTown && positions.map((r, i) => <Town key={i} position={r} />)}

      {Object.values(gameStore.roads).map((r, i) => (
        <Road key={i} position={r.position} owner={r.owner} />
      ))}

      {Object.values(gameStore.towns).map((t, i) => (
        <Town key={i} position={t.position} owner={t.owner} />
      ))}
    </Layer>
  )
}

export default Board
