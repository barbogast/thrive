import React from 'react'
import { Rect } from 'react-konva'

import config from '../config'
import * as game from '../game'
import * as draw from '../draw'
import * as hexUtils from '../hexUtils'
import { Action } from '../state'

type Props = {
  road: game.Road
  currentAction: Action
}

function Road({ road, currentAction }: Props): JSX.Element {
  if (currentAction !== Action.buildRoad) {
    return <></>
  }

  const [tile1, tile2] = road.position

  const direction = hexUtils.getDirection(
    hexUtils.offsetToAxial(tile1),
    hexUtils.offsetToAxial(tile2),
  )

  const directionToDegree = {
    0: 90,
    1: 150,
    2: 210,
    3: 270,
    4: 330,
    5: 30,
  }

  const middle = draw.getMiddle(road.position)

  return (
    <Rect
      x={middle.x}
      y={middle.y}
      offsetX={config().tileRadius / 2}
      offsetY={3}
      width={config().tileRadius}
      height={7}
      rotation={directionToDegree[direction]}
      id={'haha'}
      stroke="black"
      strokeWidth={1}
    />
  )
}

export default Road
