import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { quoteCrossfade, hintExpand, celebrateBounce, shake } from "../animations/motionVariants"
import { useTypingKeyDown } from "../hooks/useTypingSound"
import { useSound } from "../contexts/SoundContext"
import Confetti from "./ui/Confetti"
import AnimatedButton from "./ui/AnimatedButton"

const MAX_SUGGESTIONS = 5

/**
 * The main quote card: gray outer frame, white inner card,
 * serif quote text, input field, and Submit button.
 */
export default function QuoteCard({
  quoteKey,
  quote,
  hint,
  hintVisible,
  guess,
  onGuessChange,
  onSubmit,
  disabled,
  feedback,
  isCelebrating,
  answerRevealed,
  onContinue,
  revealedAnswer,
  revealedAuthor,
  shakeInput,
  answerOptions = [],
}) {
  const { playKeyboardType, enabled, ready } = useSound()
  const handleTypingKeyDown = useTypingKeyDown(playKeyboardType, { enabled, ready })
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)

  const suggestions = useMemo(() => {
    const query = guess.trim().toLowerCase()
    if (query.length < 2) return []
    return answerOptions
      .filter((title) => title.toLowerCase().includes(query) && title.toLowerCase() !== query)
      .slice(0, MAX_SUGGESTIONS)
  }, [guess, answerOptions])

  const handleKeyDown = (e) => {
    handleTypingKeyDown(e)
    if (e.key === "Enter") {
      setSuggestionsOpen(false)
      onSubmit()
    }
    if (e.key === "Escape") setSuggestionsOpen(false)
  }

  const handleSelectSuggestion = (title) => {
    onGuessChange(title)
    setSuggestionsOpen(false)
  }

  return (
    <div className="px-5 mt-[8px] flex-1 min-h-0 flex flex-col max-h-[62%]">
      <p className="text-center text-sm text-text-secondary mb-2 shrink-0">
        Read the line and guess the book.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={quoteKey}
          className="bg-card-outer rounded-2xl p-2 shadow-sm relative flex-1 min-h-0 flex flex-col"
          variants={quoteCrossfade}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Confetti active={isCelebrating} />

          <motion.div
            className="bg-white rounded-xl p-3.5 shadow-sm flex-1 min-h-0 flex flex-col relative"
            variants={celebrateBounce}
            animate={isCelebrating ? "celebrate" : "initial"}
          >
            <blockquote className="font-serif text-[17px] leading-snug text-gray-900 flex-1 min-h-0 overflow-y-auto">
              &ldquo;{quote}&rdquo;
            </blockquote>

            <AnimatePresence>
              {hintVisible && (
                <motion.div
                  variants={hintExpand}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-text-secondary italic">
                      Hint: {hint}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {feedback && (
              <motion.p
                className={`mt-4 text-sm font-medium ${
                  isCelebrating ? "text-forest" : "text-text-secondary"
                }`}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {feedback}
              </motion.p>
            )}

            {answerRevealed && (
              <motion.div
                className="mt-4 pt-4 border-t border-gray-100"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="font-serif text-lg text-gray-900">{revealedAnswer}</p>
                <p className="text-sm text-text-secondary mt-1">{revealedAuthor}</p>
                <AnimatedButton
                  onClick={onContinue}
                  className="mt-4 w-full py-2.5 rounded-lg text-sm"
                  sound="click"
                >
                  Continue
                </AnimatedButton>
              </motion.div>
            )}

            {!answerRevealed && !isCelebrating && (
              <div className="relative mt-5">
                <motion.div
                  className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-1 py-1 bg-white"
                  animate={shakeInput ? "shake" : undefined}
                  variants={shake}
                >
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => {
                      onGuessChange(e.target.value)
                      setSuggestionsOpen(true)
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    onBlur={() => setTimeout(() => setSuggestionsOpen(false), 120)}
                    onKeyDown={handleKeyDown}
                    placeholder="Make your guess"
                    disabled={disabled}
                    autoComplete="off"
                    className="flex-1 text-sm text-gray-900 placeholder:text-text-muted outline-none bg-transparent min-w-0 focus:ring-0"
                    aria-label="Your guess"
                    aria-autocomplete="list"
                    aria-expanded={suggestionsOpen && suggestions.length > 0}
                  />
                  <AnimatedButton
                    onClick={onSubmit}
                    disabled={disabled || !guess.trim()}
                    className="shrink-0 px-4 py-2 rounded-md text-sm"
                    sound="click"
                  >
                    Submit
                  </AnimatedButton>
                </motion.div>

                <AnimatePresence>
                  {suggestionsOpen && suggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      role="listbox"
                      aria-label="Matching book titles"
                      className="absolute left-0 right-0 bottom-full mb-1.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10"
                    >
                      {suggestions.map((title) => (
                        <li key={title} role="option" aria-selected="false">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectSuggestion(title)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-hint-bg transition-colors"
                          >
                            {title}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
