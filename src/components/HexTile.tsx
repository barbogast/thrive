import React from 'react'
import { Group, RegularPolygon, Text } from 'react-konva'

import { visualConfig } from '../lib/constants'
import * as axial from '../lib/axial'
import { TileType, Tile } from '../lib/board'

type Props = {
  tile: Tile
  radius: number
  fontSize: number
  onClick?: () => void
}

export function getColorForTileType(tileType: TileType): string {
  return {
    grain: 'yellow',
    wood: 'darkgreen',
    brick: '#873600',
    sheep: 'lightgreen',
    ore: 'grey',
    desert: 'lightyellow',
    water: 'blue',
    empty: 'transparent',
  }[tileType]
}

const HexTile: React.FC<Props> = function HexTile({
  tile,
  radius,
  fontSize,
  onClick,
}) {
  const pxPosition = axial.getTilePosition(radius, tile.position)

  return (
    <Group x={pxPosition.x} y={pxPosition.y} onClick={onClick || undefined}>
      <RegularPolygon
        sides={6}
        rotation={visualConfig().flatTopped ? 30 : 0}
        radius={radius + 1}
        fill={getColorForTileType(tile.type)}
        stroke={'black'}
        strokeWidth={1}
      />
      {tile.number ? (
        <Text
          text={String(tile.number)}
          fontSize={fontSize}
          fontFamily="Arial"
          offsetX={fontSize > 10 ? 6 : 3}
          offsetY={3}
          fontVariant={fontSize > 10 ? 'bold' : 'normal'}
        />
      ) : null}
    </Group>
  )
}

export default HexTile
