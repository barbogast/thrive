import React from 'react'
import { Layer } from 'react-konva'

import useStore from '../state'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'
import { ActionType } from '../state'

function Board(): JSX.Element {
  const {
    gameState: { tiles, roads, towns },
    currentAction,
  } = useStore((state) => ({
    gameState: state.gameState,
    currentAction: state.uiState.currentAction,
  }))

  return (
    <Layer>
      {Object.values(tiles).map((t, i) => (
        <HexTile key={i} tile={t} />
      ))}

      {currentAction.type === ActionType.buildRoad &&
        Object.values(currentAction.positions).map((r, i) => (
          <Road key={i} position={r} />
        ))}

      {Object.values(roads).map((r, i) => (
        <Road key={i} position={r.position} owner={r.owner} />
      ))}

      {Object.values(towns).map((t, i) => (
        <Town key={i} town={t} currentAction={currentAction.type} />
      ))}
    </Layer>
  )
}

export default Board
