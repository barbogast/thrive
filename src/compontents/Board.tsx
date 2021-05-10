import React from 'react'
import { Layer } from 'react-konva'

import useStore from '../state'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'

function Board(): JSX.Element {
  const { tiles, roads, towns } = useStore()

  return (
    <Layer>
      {Object.values(tiles).map((t, i) => (
        <HexTile key={i} color={t.color} position={t.position} />
      ))}

      {Object.values(roads).map((r, i) => (
        <Road key={i} road={r} />
      ))}

      {Object.values(towns).map((t, i) => (
        <Town key={i} town={t} />
      ))}
    </Layer>
  )
}

export default Board
