import React from 'react'
import { Rect } from 'react-konva'

import { visualConfig } from '../lib/constants'
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

const Road: React.FC<Props> = function Road({ position, owner }) {
  const gameId = routing.useGameId()
  const gameStore = useCurrentGame((game) => ({
    color: owner ? game.players[owner].color : undefined,
  }))

  const [tile1, tile2] = position

  const direction = axial.getDirection(tile1, tile2)

  const directionToDegree = {
    0: 90,
    1: 150,
    2: 210,
    3: 270,
    4: 330,
    5: 30,
  }

  const middle = axial.getMiddle(position)

  const style = owner
    ? { fill: gameStore.color }
    : { stroke: 'black', strokeWidth: 1 }

  return (
    <Rect
      x={middle.x}
      y={middle.y}
      offsetX={visualConfig().tileRadius / 2}
      offsetY={3}
      width={visualConfig().tileRadius}
      height={7}
      rotation={directionToDegree[direction]}
      {...style}
      onClick={owner ? undefined : () => setters.buildRoad(gameId, position)}
    />
  )
}

export default Road
