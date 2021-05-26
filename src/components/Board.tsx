import React, { useMemo } from 'react'
import { Layer } from 'react-konva'

import { useStore, UiActionType } from '../state'
import * as routing from '../routing'
import * as board from '../board'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'

const Board: React.FC = function Board() {
  const gameId = routing.useGameId()
  const {
    gameState: { tiles, roads, towns },
    uiAction,
    sequenceAction,
  } = useStore((state) => ({
    gameState: state.games[gameId],
    uiAction: state.uiState.currentAction,
    sequenceAction: state.games[gameId].sequence.scheduledActions[0],
  }))

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
