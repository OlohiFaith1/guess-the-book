import { motion, AnimatePresence } from "framer-motion"
import { toastMotion } from "../animations/motionVariants"

/** Subtle success toast shown after a user adds a new line. */
export default function SuccessToast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-forest text-white text-sm px-5 py-3 rounded-xl shadow-lg"
          role="status"
          aria-live="polite"
          variants={toastMotion}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
