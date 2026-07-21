import AnimatedButton from "./ui/AnimatedButton"

/** Share and Add Line icon buttons at the bottom of the game screen. */
export default function BottomActions({ onShare, onAddLine }) {
  return (
    <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center justify-between shrink-0">
      <AnimatedButton
        variant="ghost"
        onClick={onShare}
        className="p-2 rounded-lg"
        aria-label="Share game"
      >
        {/* iOS-style share icon (square and arrow up) */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3V15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 8L12 3L17 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </AnimatedButton>

      <AnimatedButton
        variant="ghost"
        onClick={onAddLine}
        className="px-3 py-2 rounded-lg gap-1.5 text-sm"
        aria-label="Add your line"
      >
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 7V15M7 11H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add your line
      </AnimatedButton>
    </div>
  )
}
