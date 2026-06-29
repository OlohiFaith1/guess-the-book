/**
 * Validates the Add Line form.
 * Returns an object of field errors (empty object = valid).
 */
export function validateAddLineForm({ quote, answer, author }) {
  const errors = {}

  if (!quote?.trim()) {
    errors.quote = "Please enter a line from the book."
  } else if (quote.trim().length < 10) {
    errors.quote = "The line should be at least 10 characters."
  }

  if (!answer?.trim()) {
    errors.answer = "Please enter the book name."
  }

  if (!author?.trim()) {
    errors.author = "Please enter the author."
  }

  return errors
}
