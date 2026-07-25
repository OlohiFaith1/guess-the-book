import { useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useTypewriter } from "../hooks/useTypewriter"
import { useSound } from "../contexts/SoundContext"
import { fadeUp } from "../animations/motionVariants"
import { QUOTES_PER_ROUND } from "../constants/game"

const HEADLINE = "Can you recognize a book from a single line?"
const LOADING_TEXT = "[Loading famous lines…]"

/** Circular logo with stacked book icons. */
function BookLogo() {
  return (
    <motion.div
      className="w-[72px] h-[72px] rounded-full border border-gray-200 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="14" height="18" rx="1.5" fill="#6b7280" />
        <line x1="9" y1="12" x2="17" y2="12" stroke="white" strokeWidth="0.8" />
        <line x1="9" y1="15" x2="16" y2="15" stroke="white" strokeWidth="0.8" />
        <rect x="16" y="10" width="14" height="18" rx="1.5" fill="#2d4a3e" />
        <line x1="19" y1="14" x2="27" y2="14" stroke="white" strokeWidth="0.8" />
        <line x1="19" y1="17" x2="26" y2="17" stroke="white" strokeWidth="0.8" />
      </svg>
    </motion.div>
  )
}

/**
 * Loading screen with typewriter headline, sounds, and staged fade-in.
 * Waits for sounds to preload before starting the typewriter.
 */
export default function LoadingScreen({ onComplete }) {
  const { playTypewriterKey, playTypewriterComplete, ready } = useSound()

  const handleCharacter = useCallback(() => {
    playTypewriterKey()
  }, [playTypewriterKey])

  // Only start typewriter after sounds are preloaded
  const { displayed, isComplete } = useTypewriter(HEADLINE, {
    speed: 38,
    startDelay: 600,
    enabled: ready,
    onCharacter: handleCharacter,
  })

  // After headline finishes, play completion chime then transition
  useEffect(() => {
    if (!isComplete) return

    playTypewriterComplete()

    const timer = setTimeout(() => {
      onComplete?.()
    }, 1800)

    return () => clearTimeout(timer)
  }, [isComplete, onComplete, playTypewriterComplete])

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <BookLogo />

      <h1 className="font-serif text-[26px] leading-snug text-gray-900 mt-8 max-w-[280px] min-h-[4.5rem]">
        {displayed}
        {!isComplete && (
          <motion.span
            className="inline-block w-[2px] h-[1em] bg-forest ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            aria-hidden="true"
          />
        )}
      </h1>

      {isComplete && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <p className="text-forest text-sm font-medium mt-6">
            {QUOTES_PER_ROUND} quotes. One session. How many can you get?
          </p>
          <p className="text-text-muted text-sm mt-2">{LOADING_TEXT}</p>
        </motion.div>
      )}

      <span className="sr-only" role="status">
        {isComplete ? "Loading game" : "Loading introduction"}
      </span>
    </motion.div>
  )
}

export { BookLogo }
