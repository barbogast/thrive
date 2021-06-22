import { Coordinate } from './axial'
import { getHexagonBoard, Tile } from './board'

function extractPositions(tiles: Tile[]): Coordinate[] {
  return tiles.map((t) => t.position)
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

    expect(extractPositions(result)).toEqual(expected)
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

    expect(extractPositions(result)).toEqual(expected)
  })
})
