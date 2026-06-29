import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { modalOverlay, modalCard } from "../../animations/motionVariants"

/**
 * Reusable modal with fade + scale animation.
 * Supports Escape key and traps focus on open.
 */
export default function Modal({ isOpen, onClose, children, ariaLabelledBy }) {
  const cardRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Focus the modal card when it opens
  useEffect(() => {
    if (isOpen && cardRef.current) {
      cardRef.current.focus()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center p-5"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
        >
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

          <motion.div
            ref={cardRef}
            tabIndex={-1}
            className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-xl outline-none"
            variants={modalCard}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
