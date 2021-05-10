import { Tile } from './game'
import { OffsetPosition } from './hexUtils'

export type TileMap = { [key: string]: Tile }

function index(position: OffsetPosition) {
  return `${position.col}_${position.row}`
}
export function fromArray(tiles: Tile[]): TileMap {
  return tiles.reduce((prev, current) => {
    prev[index(current.position)] = current
    return prev
  }, {} as TileMap)
}

export function findInPos(
  tileMap: TileMap,
  position: OffsetPosition,
): Tile | void {
  return tileMap[index(position)]
}
