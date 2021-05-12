import React from 'react'
import { Group, RegularPolygon, Text } from 'react-konva'

import { visualConfig } from '../constants'
import * as game from '../game'
import * as draw from '../draw'
import { TileType } from '../game'

type Props = {
  tile: game.Tile
}

export function getColorForTileType(tileType: TileType): string {
  return {
    grain: 'yellow',
    wood: 'darkgreen',
    brick: '#873600',
    sheep: 'lightgreen',
    ore: 'grey',
    desert: 'lightyellow',
  }[tileType]
}

function HexTile({ tile }: Props): JSX.Element {
  const pxPosition = draw.getTilePosition(tile.position)
  // const coord = `r: ${tile.position.q}\nc: ${tile.position.r}`

  return (
    <Group x={pxPosition.x} y={pxPosition.y}>
      <RegularPolygon
        sides={6}
        rotation={visualConfig().flatTopped ? 30 : 0}
        radius={visualConfig().tileRadius + 1}
        fill={getColorForTileType(tile.resource)}
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
