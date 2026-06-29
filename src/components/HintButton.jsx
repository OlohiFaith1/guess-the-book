import AnimatedButton from "./ui/AnimatedButton"

/** Pale green pill button that reveals a hint when clicked. */
export default function HintButton({ onClick, hintVisible }) {
  return (
    <AnimatedButton
      onClick={onClick}
      disabled={hintVisible}
      className="w-full mt-6 py-3.5 px-4 bg-hint-bg rounded-xl gap-2 text-forest text-sm disabled:opacity-60"
      aria-label={hintVisible ? "Hint already revealed" : "Get a hint"}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1.5L9.2 5.8L13.5 7L9.2 8.2L8 12.5L6.8 8.2L2.5 7L6.8 5.8L8 1.5Z"
          fill="currentColor"
        />
        <path
          d="M12.5 1L13 2.5L14.5 3L13 3.5L12.5 5L12 3.5L10.5 3L12 2.5L12.5 1Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
      {hintVisible ? "Hint revealed" : "Get a hint"}
    </AnimatedButton>
  )
}
