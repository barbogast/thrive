import { Tile } from './game'
import { Coordinate } from './axial'

export type TileMap = { [key: string]: Tile }

function index(position: Coordinate) {
  return `${position.q}_${position.r}`
}
export function fromArray(tiles: Tile[]): TileMap {
  return tiles.reduce((prev, current) => {
    prev[index(current.position)] = current
    return prev
  }, {} as TileMap)
}

export function findInPos(tileMap: TileMap, position: Coordinate): Tile | void {
  return tileMap[index(position)]
}
