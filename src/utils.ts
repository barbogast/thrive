export function average(numbers: number[]) {
  const sum = numbers.reduce((a, b) => a + b, 0)
  return sum / numbers.length || 0
}

export function randomNumber(max: number) {
  return Math.floor(Math.random() * max)
}
