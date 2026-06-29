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
 * Add Line modal — validates inputs and adds quotes to the in-memory list.
 */
export default function AddLineModal({ isOpen, onClose, onSubmit }) {
  const [line, setLine] = useState("")
  const [answer, setAnswer] = useState("")
  const [author, setAuthor] = useState("")
  const [errors, setErrors] = useState({})

  const { playKeyboardType, enabled, ready } = useSound()
  const handleTypingKeyDown = useTypingKeyDown(playKeyboardType, { enabled, ready })

  useEffect(() => {
    if (!isOpen) {
      setLine("")
      setAnswer("")
      setAuthor("")
      setErrors({})
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    const validationErrors = validateAddLineForm({
      quote: line,
      answer,
      author,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSubmit({
      quote: line.trim(),
      answer: answer.trim(),
      author: author.trim(),
      hint: `A line from "${answer.trim()}" by ${author.trim()}.`,
    })

    onClose()
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
            Add a line
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
          To help us increase the number of lines we have, kindly share famous
          lines from some of your favourite books.
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

          <div className="flex items-center justify-between mt-6">
            <AnimatedButton
              variant="secondary"
              onClick={handleClose}
              className="text-sm px-2 py-1 rounded-md"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton onClick={handleSubmit} className="px-5 py-2.5 rounded-lg text-sm">
              Submit line
            </AnimatedButton>
          </div>
        </form>
      </div>
    </Modal>
  )
}
