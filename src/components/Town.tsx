import React from 'react'
import { Group, Circle } from 'react-konva'

import * as game from '../lib/game'
import * as axial from '../lib/axial'
import * as position from '../lib/position'
import * as routing from '../lib/routing'
import * as setters from '../state/setters'
import { useCurrentGame } from '../state/gameState'
import { visualConfig } from '../lib/constants'

type Props = {
  position: position.Position
  owner?: game.PlayerId | void
  type: 'town' | 'city'
}

const Town: React.FC<Props> = function Town({ position, owner, type }) {
  const gameId = routing.useGameId()
  const localStore = useCurrentGame((game) => ({
    color: owner ? game.players[owner].color : undefined,
  }))
  const middle = axial.getMiddle(visualConfig().tileRadius, position)
  const style = owner
    ? {
        fill: localStore.color,
      }
    : {
        stroke: 'black',
        strokeWidth: 1,
      }

  const group = [<Circle key="town" radius={9} {...style} />]
  if (type === 'city') {
    group.push(
      <Circle
        key="city"
        radius={12}
        stroke={localStore.color}
        strokeWidth={3}
      />,
    )
  }

  return (
    <Group
      x={middle.x}
      y={middle.y}
      onClick={() => setters.buildTown(gameId, position)}
    >
      {group}
    </Group>
  )
}

export default Town
