import { motion } from "framer-motion"

/** Lightweight confetti burst for correct answers — a few soft dots, no library needed. */
export default function Confetti({ active }) {
  if (!active) return null

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120,
    y: -(Math.random() * 80 + 40),
    color: ["#2d4a3e", "#3d5f50", "#9ca3af", "#e8f0ec"][i % 4],
    size: Math.random() * 4 + 3,
    delay: Math.random() * 0.15,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.9,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
