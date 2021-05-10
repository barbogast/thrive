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
  const axial = hexUtils.offsetToAxial(position)

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
      <Text
        text={`r: ${axial.q}\nc: ${axial.r}`}
        fontSize={10}
        fontFamily="Arial"
      />
    </Group>
  )
}

export default HexTile
