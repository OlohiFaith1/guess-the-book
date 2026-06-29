import { motion, AnimatePresence } from "framer-motion"
import { quoteCrossfade, hintExpand, celebrateBounce, shake } from "../animations/motionVariants"
import { useTypingKeyDown } from "../hooks/useTypingSound"
import { useSound } from "../contexts/SoundContext"
import Confetti from "./ui/Confetti"
import AnimatedButton from "./ui/AnimatedButton"

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
}) {
  const { playKeyboardType, enabled, ready } = useSound()
  const handleTypingKeyDown = useTypingKeyDown(playKeyboardType, { enabled, ready })

  const handleKeyDown = (e) => {
    handleTypingKeyDown(e)
    if (e.key === "Enter") onSubmit()
  }

  return (
    <div className="px-5 mt-4 flex-1 min-h-0 flex flex-col">
      <p className="text-center text-sm text-text-secondary mb-3 shrink-0">
        Read the line and guess the book.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={quoteKey}
          className="bg-card-outer rounded-2xl p-3 shadow-sm relative flex-1 min-h-0 flex flex-col"
          variants={quoteCrossfade}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Confetti active={isCelebrating} />

          <motion.div
            className="bg-white rounded-xl p-5 shadow-sm flex-1 min-h-0 flex flex-col relative"
            variants={celebrateBounce}
            animate={isCelebrating ? "celebrate" : "initial"}
          >
            <blockquote className="font-serif text-[19px] leading-relaxed text-gray-900 flex-1 min-h-0 overflow-y-auto">
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
              <motion.div
                className="mt-5 flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-1 py-1 bg-white"
                animate={shakeInput ? "shake" : undefined}
                variants={shake}
              >
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => onGuessChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Make your guess"
                  disabled={disabled}
                  className="flex-1 text-sm text-gray-900 placeholder:text-text-muted outline-none bg-transparent min-w-0 focus:ring-0"
                  aria-label="Your guess"
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
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
