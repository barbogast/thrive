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

// https://stackoverflow.com/a/30800715
export function downloadObjectAsJson(
  exportObj: Record<string, unknown>,
  exportName: string,
): void {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', exportName + '.json')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}
