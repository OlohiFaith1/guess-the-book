import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedButton from "./ui/AnimatedButton"

const SKIP_CONFIRM_TIMEOUT = 3000

/**
 * Segmented progress bar — one capsule per quote, spanning a single row
 * edge to edge. Three clearly distinct states (light gray / mint / dark
 * green) so momentum reads at a glance, not just on close inspection.
 * A quiet fill-in wipe marks the current quote, and a brief spring "pop"
 * marks completion.
 */
const capsuleVariants = {
  upcoming: { scaleY: 1, backgroundColor: "#d1d5db" },
  current: { scaleY: 1, backgroundColor: "#8fc9ae" },
  completed: {
    scaleY: [1, 1.5, 1],
    backgroundColor: "#2d4a3e",
    transition: { duration: 0.45, times: [0, 0.4, 1], ease: "easeOut" },
  },
}

export default function ProgressGrid({ current, total, onSkip }) {
  const [confirmingSkip, setConfirmingSkip] = useState(false)
  const resetTimer = useRef(null)

  useEffect(() => {
    return () => clearTimeout(resetTimer.current)
  }, [])

  // Reset the confirm state whenever the active quote changes (e.g. after
  // skipping, or answering correctly and moving on).
  useEffect(() => {
    setConfirmingSkip(false)
    clearTimeout(resetTimer.current)
  }, [current])

  const handleSkipClick = () => {
    if (!confirmingSkip) {
      setConfirmingSkip(true)
      resetTimer.current = setTimeout(() => setConfirmingSkip(false), SKIP_CONFIRM_TIMEOUT)
      return
    }

    clearTimeout(resetTimer.current)
    setConfirmingSkip(false)
    onSkip()
  }

  return (
    <div className="px-5 pt-10 pb-3 shrink-0">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-sm font-medium tracking-tight text-gray-900">
          Quote {current + 1} of {total}
        </span>

        <div className="relative">
          <AnimatePresence>
            {confirmingSkip && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                role="tooltip"
                className="absolute right-0 top-full mt-2 w-[188px] bg-gray-900 text-white text-xs leading-snug px-3 py-2 rounded-lg shadow-lg z-10"
              >
                <div className="absolute right-4 bottom-full w-2 h-2 bg-gray-900 rotate-45 -mb-1" />
                You won't be able to return to this quote — skip anyway?
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatedButton
            variant="secondary"
            onClick={handleSkipClick}
            className="text-sm px-2 py-1 rounded-md"
          >
            {confirmingSkip ? "Skip anyway?" : "Skip"}
          </AnimatedButton>
        </div>
      </div>

      <div
        className="flex items-center gap-1"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Quote ${current + 1} of ${total}`}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < current
          const isCurrent = index === current
          const state = isCompleted ? "completed" : isCurrent ? "current" : "upcoming"

          return (
            <div key={index} className="relative flex-1 h-[7px] rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 rounded-full"
                variants={capsuleVariants}
                animate={state}
                initial={false}
                transition={{ duration: 0.3, ease: "easeOut" }}
                aria-label={
                  isCompleted
                    ? `Quote ${index + 1} completed`
                    : isCurrent
                      ? `Quote ${index + 1}, current`
                      : `Quote ${index + 1} remaining`
                }
              />

              {isCurrent && (
                <motion.div
                  key="fill"
                  className="absolute inset-0 rounded-full bg-forest/60 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
