import { useSound } from "../../contexts/SoundContext"
import AnimatedButton from "./AnimatedButton"

/** Global sound on/off toggle — persists preference in localStorage. */
export default function SoundToggle({ className = "" }) {
  const { enabled, toggle } = useSound()

  return (
    <AnimatedButton
      variant="ghost"
      onClick={toggle}
      className={`p-2 rounded-lg text-forest/80 hover:text-forest ${className}`}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      aria-pressed={enabled}
    >
      {enabled ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3 7.5h2.5L9 4v12l-3.5-3.5H3a1 1 0 01-1-1V8.5a1 1 0 011-1z"
            fill="currentColor"
          />
          <path
            d="M12.5 7.5a4 4 0 010 5M14.5 5.5a7 7 0 010 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3 7.5h2.5L9 4v12l-3.5-3.5H3a1 1 0 01-1-1V8.5a1 1 0 011-1z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M14 4l-8 12M16 8l-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </AnimatedButton>
  )
}
