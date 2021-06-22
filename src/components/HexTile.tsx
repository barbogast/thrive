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
  showPosition?: boolean
}

export function getColorForTileType(tileType: TileType): string {
  return {
    grain: 'yellow',
    wood: 'darkgreen',
    brick: '#873600',
    sheep: 'lightgreen',
    ore: 'grey',
    desert: 'lightyellow',
    water: '#5eadff',
    empty: 'transparent',
  }[tileType]
}

const HexTile: React.FC<Props> = function HexTile({
  tile,
  radius,
  fontSize,
  onClick,
  showPosition,
}) {
  const pxPosition = axial.getTilePosition(radius, tile.position)
  const text = showPosition
    ? `${tile.position.q}/${tile.position.r}`
    : String(tile.number)
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
          text={text}
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
