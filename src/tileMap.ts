import { Tile } from './game'
import { AxialPosition } from './axial'

export type TileMap = { [key: string]: Tile }

function index(position: AxialPosition) {
  return `${position.q}_${position.r}`
}
export function fromArray(tiles: Tile[]): TileMap {
  return tiles.reduce((prev, current) => {
    prev[index(current.position)] = current
    return prev
  }, {} as TileMap)
}

export function findInPos(
  tileMap: TileMap,
  position: AxialPosition,
): Tile | void {
  return tileMap[index(position)]
}
