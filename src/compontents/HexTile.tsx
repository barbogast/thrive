import React from 'react'
import { Group, RegularPolygon, Text } from 'react-konva'

import config from '../config'
import * as game from '../game'
import * as draw from '../draw'

type Props = {
  tile: game.Tile
}

function HexTile({ tile }: Props): JSX.Element {
  const pxPosition = draw.getTilePosition(tile.position)
  // const axial = hexUtils.offsetToAxial(position)
  // const coord = `r: ${axial.q}\nc: ${axial.r}`

  return (
    <Group x={pxPosition.x} y={pxPosition.y}>
      <RegularPolygon
        sides={6}
        rotation={config().flatTopped ? 30 : 0}
        radius={config().tileRadius + 1}
        fill={tile.color}
        stroke={'black'}
        strokeWidth={1}
        id={'asdf' + pxPosition.x + pxPosition.y}
      />
      {tile.number ? (
        <Text
          text={String(tile.number)}
          fontSize={14}
          fontFamily="Arial"
          offsetX={6}
          offsetY={3}
          fontVariant="bold"
        />
      ) : null}
    </Group>
  )
}

export default HexTile
