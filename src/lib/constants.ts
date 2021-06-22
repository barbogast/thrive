export const visualConfig = () =>
  ({
    tileRadius: 50,
    flatTopped: false,
  } as const)

export const gameConfig = () =>
  ({
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
  } as const)
