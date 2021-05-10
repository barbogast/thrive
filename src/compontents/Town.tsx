import React from 'react'
import { Circle } from 'react-konva'

import * as game from '../game'
import * as draw from '../draw'
import useStore from '../state'
import { Action } from '../state'

type Props = {
  town: game.Town
  currentAction: Action
}

function Town({ town, currentAction }: Props): JSX.Element {
  if (currentAction !== Action.buildTown && !town.owner) {
    return <></>
  }
  const buildTown = useStore((state) => state.buildTown)
  const middle = draw.getMiddle(town.position)
  const style = town.owner
    ? {
        fill: town.owner,
      }
    : {
        stroke: 'black',
        strokeWidth: 1,
      }

  return (
    <Circle
      id={town.id}
      type="town"
      x={middle.x}
      y={middle.y}
      radius={10}
      onClick={() => buildTown(town.id)}
      {...style}
    />
  )
}

export default Town
