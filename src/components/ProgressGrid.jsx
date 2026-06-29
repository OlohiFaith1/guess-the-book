import { motion } from "framer-motion"
import AnimatedButton from "./ui/AnimatedButton"

/**
 * Grid-style progress indicator — one rounded square per quote.
 * Adapts to any number of quotes via flex-wrap.
 */
export default function ProgressGrid({ current, total, onSkip }) {
  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-900">
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
        className="flex flex-wrap gap-1.5"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Quote ${current + 1} of ${total}`}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < current
          const isCurrent = index === current

          return (
            <motion.div
              key={index}
              className={[
                "w-[22px] h-[22px] rounded-[5px]",
                isCompleted && "bg-forest",
                isCurrent && "bg-forest/20 ring-2 ring-forest ring-offset-1",
                !isCompleted && !isCurrent && "bg-white border border-gray-200",
              ]
                .filter(Boolean)
                .join(" ")}
              initial={false}
              animate={{
                scale: isCurrent ? 1.1 : 1,
                opacity: isCompleted ? 1 : isCurrent ? 1 : 0.85,
              }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              aria-label={
                isCompleted
                  ? `Quote ${index + 1} completed`
                  : isCurrent
                    ? `Quote ${index + 1}, current`
                    : `Quote ${index + 1} remaining`
              }
            />
          )
        })}
      </div>
    </div>
  )
}
