export function average(numbers: number[]) {
  const sum = numbers.reduce((a, b) => a + b, 0)
  return sum / numbers.length || 0
}
