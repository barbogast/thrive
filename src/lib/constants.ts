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
        wood: 1,
      },
      ship: {
        sheep: 1,
        wood: 1,
      },
      town: {
        brick: 1,
        grain: 1,
        sheep: 1,
        wood: 1,
      },
      city: {
        grain: 2,
        ore: 3,
      },
    },
  } as const)
