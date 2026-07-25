import { motion, AnimatePresence } from "framer-motion"
import { useFirstRun } from "../hooks/useFirstRun"

/**
 * Attempt dots — "remaining" is a solid filled dot, "used" is a hollow
 * outlined dot, so the state reads at a glance without relying on the text
 * label. On a player's very first quote (before any guesses), a dismissable
 * inline tip explains what the dots mean.
 */
export default function AttemptsIndicator({ attemptsLeft, maxAttempts, showTipEligible }) {
  const [tipVisible, dismissTip] = useFirstRun("gtb_seen_attempts_tip")
  const showTip = showTipEligible && tipVisible

  return (
    <div className="flex flex-col items-center mt-3 shrink-0">
      <div className="flex gap-2" aria-label={`${attemptsLeft} attempts left`}>
        {Array.from({ length: maxAttempts }).map((_, i) => {
          const remaining = i < attemptsLeft
          return (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full box-border"
              animate={{
                backgroundColor: remaining ? "#2d4a3e" : "#ffffff",
                borderColor: remaining ? "#2d4a3e" : "#9ca3af",
                borderWidth: remaining ? 0 : 1.5,
                scale: remaining ? 1 : 0.85,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ borderStyle: "solid" }}
            />
          )
        })}
      </div>

      <p className="text-xs text-text-secondary mt-2" aria-live="polite">
        {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} left
      </p>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 max-w-[260px]"
          >
            <div className="flex items-start gap-2 bg-hint-bg text-forest text-xs leading-snug rounded-lg px-3 py-2">
              <span className="flex-1">
                You have {maxAttempts} tries per quote. Each wrong guess uses one.
              </span>
              <button
                type="button"
                onClick={dismissTip}
                aria-label="Dismiss tip"
                className="shrink-0 -mr-0.5 -mt-0.5 p-1 opacity-70 hover:opacity-100"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 2L10 10M10 2L2 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
