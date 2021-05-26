import React from 'react'
import { Circle } from 'react-konva'

import * as game from '../game'
import * as axial from '../axial'
import * as position from '../position'
import * as routing from '../routing'
import * as setters from '../state/setters'
import { useStores } from '../state/useStores'
import { useGameStore } from '../state/gameState'

type Props = {
  position: position.Position
  owner?: game.PlayerId | void
}

const Town: React.FC<Props> = function Town({ position, owner }) {
  const gameId = routing.useGameId()
  const localStore = useGameStore((state) => ({
    color: owner ? state.games[gameId].players[owner].color : undefined,
  }))
  const stores = useStores()
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
      onClick={
        owner ? undefined : () => setters.buildTown(stores)(gameId, position)
      }
      {...style}
    />
  )
}

export default Town
