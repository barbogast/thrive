import React, { useEffect, useMemo } from 'react'
import { Layer } from 'react-konva'

import { useStores } from '../state/useStores'
import { useLocalStore, UiActionType } from '../state/localState'
import * as routing from '../routing'
import * as board from '../board'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'
import { useGameStore, useGameStoreApi } from '../state/gameState'
import { sendState } from '../hooks/useConnection'

const Board: React.FC = function Board() {
  const gameId = routing.useGameId()
  const { uiAction, myId } = useLocalStore((state) => ({
    myId: state.myId,
    uiAction: state.uiState.currentAction,
  }))
  const {
    gameState: { tiles, roads, towns },
    sequenceAction,
  } = useGameStore((state) => ({
    gameState: state.games[gameId],
    sequenceAction: state.games[gameId].sequence.scheduledActions[0],
  }))
  const stores = useStores()

  const buildRoad =
    uiAction.type === UiActionType.buildRoad ||
    sequenceAction.type === 'buildRoad'
  const buildTown =
    uiAction.type === UiActionType.buildTown ||
    sequenceAction.type === 'buildTown'

  const positions = useMemo(() => {
    if (buildRoad) {
      return board.getRoadPositions(tiles)
    } else if (buildTown) {
      return board.getTownPositions(tiles)
    } else {
      return []
    }
  }, [tiles, buildRoad, buildTown])

  const gameStoreApi = useGameStoreApi()
  useEffect(() => {
    return gameStoreApi.subscribe((newState, oldState) => {
      if (oldState.games[gameId].sequence.scheduledActions[0].playerId === myId)
        sendState(stores)(gameId)
    })
  }, [])

  return (
    <Layer>
      {Object.values(tiles).map((t, i) => (
        <HexTile key={i} tile={t} />
      ))}

      {buildRoad && positions.map((r, i) => <Road key={i} position={r} />)}

      {buildTown && positions.map((r, i) => <Town key={i} position={r} />)}

      {Object.values(roads).map((r, i) => (
        <Road key={i} position={r.position} owner={r.owner} />
      ))}

      {Object.values(towns).map((t, i) => (
        <Town key={i} position={t.position} owner={t.owner} />
      ))}
    </Layer>
  )
}

export default Board
