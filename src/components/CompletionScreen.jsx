import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { fadeUp } from "../animations/motionVariants"
import { useSound } from "../contexts/SoundContext"
import AnimatedButton from "./ui/AnimatedButton"

/** Shown after all quotes — displays final score and a Restart button. */
export default function CompletionScreen({ score, total, onRestart }) {
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

      <AnimatedButton
        onClick={onRestart}
        className="mt-10 w-full max-w-[280px] py-3.5 rounded-xl text-sm"
      >
        Restart
      </AnimatedButton>
    </motion.div>
  )
}
