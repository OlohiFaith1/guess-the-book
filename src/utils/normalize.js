/**
 * Prepares user input for comparison.
 * Trims whitespace and ignores capitalization.
 */
export function normalizeGuess(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ")
}

/** Returns true when the guess matches the book answer. */
export function isCorrectGuess(guess, answer) {
  return normalizeGuess(guess) === normalizeGuess(answer)
}
