import React from 'react'
import { Circle } from 'react-konva'

import * as game from '../game'
import * as axial from '../axial'
import useStore from '../state'
import { Action } from '../state'

type Props = {
  town: game.Town
  currentAction: Action
}

function Town({ town, currentAction }: Props): JSX.Element {
  const buildTown = useStore((state) => state.buildTown)

  if (currentAction !== Action.buildTown && !town.owner) {
    return <></>
  }
  const middle = axial.getMiddle(town.position)
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
