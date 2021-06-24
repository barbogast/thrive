import { Coordinate } from './axial'
import { getHexagonBoard, Tile, TileType } from './board'

function extractLandPositions(tiles: Tile[]): Coordinate[] {
  return tiles.filter((t) => t.type !== TileType.water).map((t) => t.position)
}

describe('getHexagonBoard()', () => {
  it('should generate the correct board with size 3', () => {
    const expected = [
      { q: -1, r: 0 },
      { q: -1, r: 1 },

      { q: 0, r: -1 },
      { q: 0, r: 0 },
      { q: 0, r: 1 },

      { q: 1, r: -1 },
      { q: 1, r: 0 },
    ]

    const result = getHexagonBoard('3')

    expect(extractLandPositions(result)).toEqual(expected)
  })

  it('should generate the correct board with size 5', () => {
    const expected = [
      { q: -2, r: 0 },
      { q: -2, r: 1 },
      { q: -2, r: 2 },

      { q: -1, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: -1, r: 2 },

      { q: 0, r: -2 },
      { q: 0, r: -1 },
      { q: 0, r: 0 },
      { q: 0, r: 1 },
      { q: 0, r: 2 },

      { q: 1, r: -2 },
      { q: 1, r: -1 },
      { q: 1, r: 0 },
      { q: 1, r: 1 },

      { q: 2, r: -2 },
      { q: 2, r: -1 },
      { q: 2, r: 0 },
    ]

    const result = getHexagonBoard('5')

    expect(extractLandPositions(result)).toEqual(expected)
  })
})
