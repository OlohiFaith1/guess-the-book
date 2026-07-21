import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { fadeUp } from "../animations/motionVariants"
import { useSound } from "../contexts/SoundContext"
import AnimatedButton from "./ui/AnimatedButton"

/** Shown after all quotes — displays final score, sharing, and add-a-line prompts. */
export default function CompletionScreen({ score, total, onRestart, onShare, onAddLine }) {
  const { playCompletion } = useSound()
  const played = useRef(false)
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  useEffect(() => {
    if (!played.current) {
      playCompletion()
      played.current = true
    }
  }, [playCompletion])

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-8 text-center"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-hint-bg flex items-center justify-center mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M8 16L14 22L24 10"
            stroke="#2d4a3e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <h1 className="font-serif text-3xl text-gray-900">You finished!</h1>

      <p className="text-text-secondary text-sm mt-3 max-w-[260px]">
        You guessed {score} out of {total} books correctly ({percentage}%).
      </p>

      <motion.div
        className="mt-8 w-full max-w-[200px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
      >
        <div className="text-5xl font-serif text-forest mb-1">{score}</div>
        <p className="text-xs text-text-muted uppercase tracking-wider">Correct guesses</p>
      </motion.div>

      <motion.div
        className="mt-10 w-full max-w-[280px] flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
      >
        <AnimatedButton
          onClick={onShare}
          className="w-full py-3.5 rounded-xl text-sm"
        >
          Share with friends
        </AnimatedButton>

        <div className="flex gap-3">
          <AnimatedButton
            variant="secondary"
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl text-sm border border-gray-200"
          >
            Restart
          </AnimatedButton>
        </div>
      </motion.div>

      <p className="text-text-secondary text-sm mt-8 max-w-[260px]">
        Now, it's your turn — add a line from a book you've read.
      </p>

      <AnimatedButton
        variant="ghost"
        onClick={onAddLine}
        className="mt-3 px-4 py-2.5 rounded-lg gap-1.5 text-sm border border-forest/20"
      >
        <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 7V15M7 11H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add your line
      </AnimatedButton>
    </motion.div>
  )
}
