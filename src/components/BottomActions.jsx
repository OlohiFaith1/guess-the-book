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
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path
            d="M14 6L18 2M18 2H14M18 2V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 11C18 14.866 14.866 18 11 18C7.134 18 4 14.866 4 11C4 7.134 7.134 4 11 4H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </AnimatedButton>

      <AnimatedButton
        variant="ghost"
        onClick={onAddLine}
        className="p-2 rounded-lg"
        aria-label="Add a line"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 7V15M7 11H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </AnimatedButton>
    </div>
  )
}
