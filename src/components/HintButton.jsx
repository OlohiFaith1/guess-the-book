import AnimatedButton from "./ui/AnimatedButton"

/** Pale green pill button that reveals a hint when clicked. */
export default function HintButton({ onClick, hintVisible }) {
  return (
    <AnimatedButton
      onClick={onClick}
      disabled={hintVisible}
      className="w-full mt-4 py-3.5 px-4 bg-[#8FC9AE] shadow-sm rounded-xl gap-2 text-white text-sm font-semibold disabled:opacity-60 disabled:shadow-none shrink-0"
      aria-label={hintVisible ? "Hint already revealed" : "Get a hint"}
    >
      {/* Lightbulb — reads as "reveal a hint", distinct from the "+" add-line icon */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 7.6 4.3 8.9 5.5 9.8V11.5C5.5 11.8 5.7 12 6 12H10C10.3 12 10.5 11.8 10.5 11.5V9.8C11.7 8.9 12.5 7.6 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M6.3 14H9.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M6.7 12.3H9.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {hintVisible ? "Hint revealed" : "Get a hint"}
    </AnimatedButton>
  )
}
