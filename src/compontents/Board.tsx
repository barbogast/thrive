import React from 'react'
import { Layer } from 'react-konva'

import * as game from '../game'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'

type Props = {
  gameState: game.GameState
  onTownClick: (id: string) => void
}

function Board({ gameState, onTownClick }: Props): JSX.Element {
  return (
    <Layer>
      {Object.values(gameState.tiles).map((t, i) => (
        <HexTile key={i} color={t.color} position={t.position} />
      ))}

      {Object.values(gameState.roads).map((r, i) => (
        <Road key={i} road={r} />
      ))}

      {Object.values(gameState.towns).map((t, i) => (
        <Town key={i} town={t} onClick={onTownClick} />
      ))}
    </Layer>
  )
}

export default Board
