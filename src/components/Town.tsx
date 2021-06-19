import React from 'react'
import { Circle } from 'react-konva'

import * as game from '../lib/game'
import * as axial from '../lib/axial'
import * as position from '../lib/position'
import * as routing from '../lib/routing'
import * as setters from '../state/setters'
import { useCurrentGame } from '../state/gameState'

type Props = {
  position: position.Position
  owner?: game.PlayerId | void
}

const Town: React.FC<Props> = function Town({ position, owner }) {
  const gameId = routing.useGameId()
  const localStore = useCurrentGame((game) => ({
    color: owner ? game.players[owner].color : undefined,
  }))
  const middle = axial.getMiddle(position)
  const style = owner
    ? {
        fill: localStore.color,
      }
    : {
        stroke: 'black',
        strokeWidth: 1,
      }

  return (
    <Circle
      type="town"
      x={middle.x}
      y={middle.y}
      radius={10}
      onClick={owner ? undefined : () => setters.buildTown(gameId, position)}
      {...style}
    />
  )
}

export default Town
