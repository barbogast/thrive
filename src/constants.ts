export function visualConfig() {
  return {
    tileRadius: 50,
    flatTopped: false,
  }
}

export function gameConfig() {
  return {
    hexagonPositions: {
      '3': [
        { q: -1, r: 0 },
        { q: -1, r: 1 },

        { q: 0, r: -1 },
        { q: 0, r: 0 },
        { q: 0, r: 1 },

        { q: 1, r: -1 },
        { q: 1, r: 0 },
      ],
      '5': [
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
      ],
    },

    resourceCost: {
      road: {
        brick: 1,
        grain: 0,
        ore: 0,
        sheep: 0,
        wood: 1,
      },
      town: {
        brick: 1,
        grain: 1,
        ore: 0,
        sheep: 1,
        wood: 1,
      },
    },
  }
}
