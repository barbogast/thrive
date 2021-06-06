export function average(numbers) {
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length || 0;
}
export function randomNumber(max) {
  return Math.floor(Math.random() * max);
}
export function assert(callback) {
  let isCorrect;
  try {
    isCorrect = callback();
  } catch (e) {
    console.error(e);
    isCorrect = false;
  }
  if (!isCorrect) {
    throw new Error("Assertion failed");
  }
}
