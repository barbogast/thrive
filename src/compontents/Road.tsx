import React from 'react'
import { Rect } from 'react-konva'

import { visualConfig } from '../constants'
import * as game from '../game'
import * as axial from '../axial'
import useStore, { ActionType } from '../state'

type Props = {
  road: game.Road
  currentAction: ActionType
}

function Road({ road, currentAction }: Props): JSX.Element {
  const buildRoad = useStore((state) => state.buildRoad)

  if (currentAction !== ActionType.buildRoad && !road.owner) {
    return <></>
  }

  const [tile1, tile2] = road.position

  const direction = axial.getDirection(tile1, tile2)

  const directionToDegree = {
    0: 90,
    1: 150,
    2: 210,
    3: 270,
    4: 330,
    5: 30,
  }

  const middle = axial.getMiddle(road.position)

  const style = road.owner
    ? {
        fill: road.owner,
      }
    : {
        stroke: 'black',
        strokeWidth: 1,
      }

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
      onClick={() => buildRoad(road.id)}
    />
  )
}

export default Road
