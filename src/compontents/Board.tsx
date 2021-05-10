import React from 'react'
import { Layer } from 'react-konva'

import useStore from '../state'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'

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

      {Object.values(roads).map((r, i) => (
        <Road key={i} road={r} currentAction={currentAction} />
      ))}

      {Object.values(towns).map((t, i) => (
        <Town key={i} town={t} />
      ))}
    </Layer>
  )
}

export default Board
