import { motion, useReducedMotion } from "framer-motion"

/**
 * Desktop-only decorative layer around the phone: floating book
 * illustrations, small doodles, and handwritten-style annotations with
 * curved arrows. Purely decorative (aria-hidden) — never competes with the
 * phone, which stays the visual hero. Hidden entirely on mobile/tablet via
 * the .landing-decor CSS rule (display: none below 1024px).
 *
 * All motion respects prefers-reduced-motion via Framer's useReducedMotion —
 * the global CSS override only catches native CSS animations, not these
 * JS-driven ones, so it's handled explicitly here.
 */

/** Slow up/down drift with a faint rotation wobble — used for books. */
function floatSlow(reduce, delay = 0) {
  if (reduce) return {}
  return {
    animate: { y: [0, -10, 0], rotate: [0, 2, 0] },
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay },
  }
}

function floatSlower(reduce, delay = 0.6) {
  if (reduce) return {}
  return {
    animate: { y: [0, -8, 0], rotate: [0, -3, 0] },
    transition: { duration: 8.5, repeat: Infinity, ease: "easeInOut", delay },
  }
}

/** Gentle vertical drift, no rotation — used for small doodles. */
function drift(reduce) {
  if (reduce) return {}
  return {
    animate: { y: [0, -6, 0] },
    transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
  }
}

function fadeIn(reduce, delay = 0) {
  return {
    initial: { opacity: 0, scale: reduce ? 1 : 0.85 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: reduce ? 0.4 : 0.8, delay: reduce ? 0 : delay, ease: "easeOut" },
  }
}

/** Closed book — cover with a spine highlight and page edge. */
function ClosedBook({ className }) {
  return (
    <svg width="76" height="94" viewBox="0 0 76 94" fill="none" className={className}>
      <rect x="4" y="3" width="66" height="88" rx="4" fill="#2d4a3e" />
      <rect x="4" y="3" width="10" height="88" rx="4" fill="#3d5f50" />
      <rect x="66" y="6" width="6" height="82" rx="2" fill="#f7f1e6" />
      <rect x="26" y="30" width="30" height="2.5" rx="1.25" fill="#d7a94a" opacity="0.85" />
      <rect x="26" y="40" width="20" height="2.5" rx="1.25" fill="#d7a94a" opacity="0.6" />
    </svg>
  )
}

/** Open book — two-page spread with a center spine shadow. */
function OpenBook({ className }) {
  return (
    <svg width="104" height="66" viewBox="0 0 104 66" fill="none" className={className}>
      <path d="M52 10C44 5 20 3 6 6V56C20 53 44 55 52 60V10Z" fill="#f7f1e6" />
      <path d="M52 10C60 5 84 3 98 6V56C84 53 60 55 52 60V10Z" fill="#f2e9d8" />
      <path d="M52 10V60" stroke="#c9bda3" strokeWidth="1.5" />
      <path d="M16 18H40M16 26H40M16 34H36" stroke="#9ca88f" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path d="M64 18H88M64 26H88M64 34H84" stroke="#9ca88f" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

/** Small stack of two angled books. */
function StackedBooks({ className }) {
  return (
    <svg width="88" height="60" viewBox="0 0 88 60" fill="none" className={className}>
      <rect x="6" y="30" width="66" height="16" rx="3" transform="rotate(-4 6 30)" fill="#c98d7f" />
      <rect x="14" y="12" width="60" height="16" rx="3" transform="rotate(3 14 12)" fill="#d7a94a" />
    </svg>
  )
}

function Sparkle({ className, color = "#2d4a3e" }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className={className}>
      <path
        d="M13 1.5L15.3 10.7L24.5 13L15.3 15.3L13 24.5L10.7 15.3L1.5 13L10.7 10.7L13 1.5Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  )
}

function StarOutline({ className, color = "#2d4a3e" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className}>
      <path
        d="M11 2L13.2 8.4L20 11L13.2 13.6L11 20L8.8 13.6L2 11L8.8 8.4L11 2Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  )
}

function Squiggle({ className, color = "#2d4a3e" }) {
  return (
    <svg width="46" height="18" viewBox="0 0 46 18" fill="none" className={className}>
      <path
        d="M2 14C7 4 11 4 15 10C19 16 23 6 27 6C31 6 33 14 38 12C41 10.8 42.5 8 44 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

function Loop({ className, color = "#2d4a3e" }) {
  return (
    <svg width="32" height="30" viewBox="0 0 32 30" fill="none" className={className}>
      <path
        d="M4 20C4 8 14 3 20 9C25 14 20 22 14 20C9 18.3 10 10 17 8C22.5 6.4 28 10 29 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

/** Hand-drawn curved arrow. `flip` mirrors it to point the other way. */
function CurvedArrow({ className, flip = false, delay = 0, reduce }) {
  return (
    <svg
      width="70"
      height="46"
      viewBox="0 0 70 46"
      fill="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <motion.path
        d="M2 4C22 2 52 8 60 30"
        stroke="#3d5f50"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0.3 : 1.1, delay: reduce ? 0 : delay, ease: "easeInOut" }}
      />
      <motion.path
        d="M48 27L60 30L54 40"
        stroke="#3d5f50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: reduce ? 0.2 : delay + 1, ease: "easeOut" }}
      />
    </svg>
  )
}

/** Handwritten annotation with an arrow gesturing toward the phone. */
function Annotation({ text, className, arrowFlip, arrowClassName, delay = 0, reduce }) {
  return (
    <div className={`absolute select-none ${className}`}>
      <motion.p
        {...fadeIn(reduce, delay)}
        className="font-hand text-forest text-2xl xl:text-[1.75rem] leading-none whitespace-nowrap"
      >
        {text}
      </motion.p>
      <CurvedArrow flip={arrowFlip} delay={delay + 0.3} className={arrowClassName} reduce={reduce} />
    </div>
  )
}

export default function DesktopDecor() {
  const reduce = useReducedMotion()

  return (
    <div className="landing-decor" aria-hidden="true">
      {/* ── Left side ── */}
      <motion.div className="absolute" style={{ left: "6%", top: "13%" }} {...floatSlow(reduce)}>
        <motion.div {...fadeIn(reduce, 0.1)}>
          <ClosedBook />
        </motion.div>
      </motion.div>

      <Annotation
        text="Guess from one line."
        className="left-[4%] top-[30%]"
        arrowClassName="mt-1 ml-1"
        delay={0.5}
        reduce={reduce}
      />

      <motion.div className="absolute" style={{ left: "23%", top: "8%" }} {...drift(reduce)}>
        <motion.div {...fadeIn(reduce, 0.3)}>
          <Sparkle />
        </motion.div>
      </motion.div>

      <motion.div className="absolute" style={{ left: "8%", bottom: "11%" }} {...floatSlower(reduce)}>
        <motion.div {...fadeIn(reduce, 0.2)}>
          <StackedBooks />
        </motion.div>
      </motion.div>

      <Annotation
        text="Read. Guess. Repeat."
        className="left-[5%] bottom-[20%]"
        arrowClassName="mt-1 ml-1"
        delay={0.9}
        reduce={reduce}
      />

      <motion.div className="absolute" style={{ left: "22%", bottom: "9%" }} {...drift(reduce)}>
        <motion.div {...fadeIn(reduce, 0.6)}>
          <Squiggle />
        </motion.div>
      </motion.div>

      {/* ── Right side ── */}
      <motion.div className="absolute" style={{ right: "21%", top: "10%" }} {...drift(reduce)}>
        <motion.div {...fadeIn(reduce, 0.4)}>
          <StarOutline />
        </motion.div>
      </motion.div>

      <Annotation
        text="Only true bookworms know this one."
        className="right-[4%] top-[36%] text-right"
        arrowFlip
        arrowClassName="mt-1 ml-auto mr-1"
        delay={0.7}
        reduce={reduce}
      />

      <motion.div className="absolute" style={{ right: "7%", bottom: "13%" }} {...floatSlow(reduce, 0.4)}>
        <motion.div {...fadeIn(reduce, 0.15)}>
          <OpenBook />
        </motion.div>
      </motion.div>

      <motion.div className="absolute" style={{ right: "20%", bottom: "23%" }} {...floatSlower(reduce, 1)}>
        <motion.div {...fadeIn(reduce, 0.5)}>
          <Loop />
        </motion.div>
      </motion.div>
    </div>
  )
}
