import { useState, useEffect } from "react"
import Modal from "./ui/Modal"
import AnimatedButton from "./ui/AnimatedButton"
import { useTypingKeyDown } from "../hooks/useTypingSound"
import { useSound } from "../contexts/SoundContext"
import { validateAddLineForm } from "../utils/validation"

/** Underlined text input with typing sound on real keystrokes. */
function FormField({ label, id, placeholder, value, onChange, error, onTypingKeyDown }) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-[10px] font-semibold tracking-widest text-text-muted uppercase mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onTypingKeyDown}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full text-sm text-gray-900 placeholder:text-text-muted border-b pb-2 outline-none bg-transparent transition-colors focus-visible:border-forest ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Add Line modal — validates inputs and submits the quote for review.
 * Submissions are stored as 'pending' and reviewed manually; they do not
 * appear in anyone's game immediately.
 */
export default function AddLineModal({ isOpen, onClose, onSubmit }) {
  const [line, setLine] = useState("")
  const [answer, setAnswer] = useState("")
  const [author, setAuthor] = useState("")
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const { playKeyboardType, enabled, ready } = useSound()
  const handleTypingKeyDown = useTypingKeyDown(playKeyboardType, { enabled, ready })

  useEffect(() => {
    if (!isOpen) {
      setLine("")
      setAnswer("")
      setAuthor("")
      setErrors({})
      setSubmitError("")
      setSubmitting(false)
    }
  }, [isOpen])

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const handleSubmit = async () => {
    const validationErrors = validateAddLineForm({
      quote: line,
      answer,
      author,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setSubmitError("")

    try {
      await onSubmit({
        quote: line.trim(),
        bookTitle: answer.trim(),
        author: author.trim(),
      })
      onClose()
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleFieldChange = (field, value, setter) => {
    setter(value)
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabelledBy="add-line-title">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 id="add-line-title" className="text-base font-semibold text-gray-900">
            Submit a quote
          </h2>
          <AnimatedButton
            variant="secondary"
            onClick={handleClose}
            className="p-1 rounded-md -mt-1"
            aria-label="Close add line dialog"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </AnimatedButton>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-6">
          Share a famous line from a book you've read. Submissions are
          reviewed before they join the game — yours won't appear right away.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <FormField
            label="Line"
            id="add-line"
            placeholder="e.g in a land of myth and a time of magic"
            value={line}
            onChange={(v) => handleFieldChange("quote", v, setLine)}
            onTypingKeyDown={handleTypingKeyDown}
            error={errors.quote}
          />
          <FormField
            label="Book Name"
            id="add-book"
            placeholder="e.g Merlin"
            value={answer}
            onChange={(v) => handleFieldChange("answer", v, setAnswer)}
            onTypingKeyDown={handleTypingKeyDown}
            error={errors.answer}
          />
          <FormField
            label="Author"
            id="add-author"
            placeholder="e.g Gaius Camelot"
            value={author}
            onChange={(v) => handleFieldChange("author", v, setAuthor)}
            onTypingKeyDown={handleTypingKeyDown}
            error={errors.author}
          />

          {submitError && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-between mt-6">
            <AnimatedButton
              variant="secondary"
              onClick={handleClose}
              disabled={submitting}
              className="text-sm px-2 py-1 rounded-md"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm"
            >
              {submitting ? "Submitting…" : "Submit"}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </Modal>
  )
}
