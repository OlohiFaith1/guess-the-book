import { motion } from "framer-motion"
import AnimatedButton from "./ui/AnimatedButton"

/**
 * Segmented progress bar — one thin capsule per quote, spanning a single
 * row edge to edge. Calm and understated: a quiet fill-in wipe marks the
 * current quote, and a brief spring "pop" marks completion — nothing loud.
 */
const capsuleVariants = {
  upcoming: { scaleY: 1, backgroundColor: "#e5e7eb" },
  current: { scaleY: 1, backgroundColor: "rgba(45, 74, 62, 0.18)" },
  completed: {
    scaleY: [1, 1.6, 1],
    backgroundColor: "#2d4a3e",
    transition: { duration: 0.45, times: [0, 0.4, 1], ease: "easeOut" },
  },
}

export default function ProgressGrid({ current, total, onSkip }) {
  return (
    <div className="px-5 pt-10 shrink-0">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-sm font-medium tracking-tight text-gray-900">
          Quote {current + 1} of {total}
        </span>
        <AnimatedButton
          variant="secondary"
          onClick={onSkip}
          className="text-sm px-2 py-1 rounded-md"
        >
          Skip
        </AnimatedButton>
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
            <div key={index} className="relative flex-1 h-[5px] rounded-full overflow-hidden">
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
