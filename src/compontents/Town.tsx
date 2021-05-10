import React from 'react'
import { Circle } from 'react-konva'

import * as game from '../game'
import * as draw from '../draw'

type Props = {
  town: game.Town
  onClick: (id: string) => void
}

function Town({ town, onClick }: Props): JSX.Element {
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
      onClick={() => onClick(town.id)}
      {...style}
    />
  )
}

export default Town
