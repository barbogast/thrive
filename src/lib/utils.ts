export function average(numbers: number[]): number {
  const sum = numbers.reduce((a, b) => a + b, 0)
  return sum / numbers.length || 0
}

export function randomNumber(max: number): number {
  return Math.floor(Math.random() * max)
}

export function assert(callback: () => boolean): void {
  let isCorrect
  try {
    isCorrect = callback()
  } catch (e) {
    console.error(e)
    isCorrect = false
  }
  if (!isCorrect) {
    throw new Error('Assertion failed')
  }
}

export function range(min: number, max: number): number[] {
  if (min > max) {
    throw new Error(`min (${min}) must not be greater than max (${max})`)
  }
  const arr = []
  for (let i = min; i <= max; i++) {
    arr.push(i)
  }
  return arr
}
