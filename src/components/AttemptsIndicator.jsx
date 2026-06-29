import { motion } from "framer-motion"

/** Three dots showing remaining attempts — used dots fade to gray smoothly. */
export default function AttemptsIndicator({ attemptsLeft, maxAttempts }) {
  return (
    <div className="flex flex-col items-center mt-3 shrink-0">
      <div className="flex gap-2" aria-label={`${attemptsLeft} attempts left`}>
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: i < attemptsLeft ? "#2d4a3e" : "#d1d5db",
              scale: i < attemptsLeft ? 1 : 0.85,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        ))}
      </div>
      <p className="text-xs text-text-secondary mt-2" aria-live="polite">
        {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} left
      </p>
    </div>
  )
}
