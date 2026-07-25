import { motion } from "framer-motion"
import { buttonTap, buttonHover } from "../../animations/motionVariants"
import { useSound } from "../../contexts/SoundContext"

/**
 * Reusable animated button with hover, press, focus, and optional click sound.
 */
export default function AnimatedButton({
  children,
  variant = "primary",
  className = "",
  disabled,
  sound = "click",
  onClick,
  ...props
}) {
  const { playButtonClick } = useSound()

  const variants = {
    primary: "bg-forest text-white hover:bg-forest-light focus-visible:ring-forest/40",
    // gray-600 keeps the muted look while clearing WCAG AA (4.5:1) on white
    secondary: "bg-transparent text-gray-600 hover:text-gray-700 focus-visible:ring-gray-300",
    ghost: "bg-transparent text-forest hover:opacity-70 focus-visible:ring-forest/30",
  }

  const handleClick = (e) => {
    if (!disabled && sound !== false) {
      playButtonClick()
    }
    onClick?.(e)
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : buttonHover}
      whileTap={disabled ? undefined : buttonTap}
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
