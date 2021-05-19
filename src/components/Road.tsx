import React from 'react'
import { Rect } from 'react-konva'

import { visualConfig } from '../constants'
import * as game from '../game'
import * as axial from '../axial'
import * as position from '../position'
import * as routing from '../routing'
import { useStore } from '../state'

type Props = {
  position: position.Position
  owner?: game.PlayerId | void
}

const Road: React.FC<Props> = function Road({ position, owner }) {
  const gameId = routing.useGameId()
  const store = useStore((state) => ({
    buildRoad: state.buildRoad,
    color: owner ? state.games[gameId].players[owner].color : undefined,
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
    ? { fill: store.color }
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
      onClick={owner ? undefined : () => store.buildRoad(gameId, position)}
    />
  )
}

export default Road
