import React from 'react'
import { Circle } from 'react-konva'

import * as game from '../game'
import * as axial from '../axial'
import * as position from '../position'
import useStore from '../state'

type Props = {
  position: position.Position
  owner?: game.PlayerId | void
}

function Town({ position, owner }: Props): JSX.Element {
  const buildTown = useStore((state) => state.buildTown)

  const middle = axial.getMiddle(position)
  const style = owner
    ? {
        fill: owner,
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
      onClick={owner ? undefined : () => buildTown(position)}
      {...style}
    />
  )
}

export default Town