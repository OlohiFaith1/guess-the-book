import Modal from "./ui/Modal"
import AnimatedButton from "./ui/AnimatedButton"
import { QUOTES_PER_ROUND, MAX_ATTEMPTS } from "../constants/game"

/**
 * One-time "how to play" card shown before a player's first-ever quote.
 * Wordle-style: a single lightweight, dismissable overview rather than a
 * multi-step tour — reduces first-time confusion without getting in the way.
 */
export default function WelcomeOverlay({ isOpen, onDismiss }) {
  return (
    <Modal isOpen={isOpen} onClose={onDismiss} ariaLabelledBy="welcome-title">
      <div className="p-6">
        <h2 id="welcome-title" className="font-serif text-2xl text-gray-900">
          How to play
        </h2>

        <p className="text-sm text-text-secondary mt-3 leading-relaxed">
          Read the line, guess the book. You get {MAX_ATTEMPTS} tries per
          quote across {QUOTES_PER_ROUND} rounds — use a hint any time you're
          stuck.
        </p>

        <ul className="mt-5 space-y-3">
          <li className="flex items-start gap-3 text-sm text-gray-900">
            <span className="shrink-0 w-6 h-6 rounded-full bg-hint-bg flex items-center justify-center font-serif text-xs text-forest">
              1
            </span>
            Read the quote and type your guess for the book title.
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-900">
            <span className="shrink-0 w-6 h-6 rounded-full bg-hint-bg flex items-center justify-center font-serif text-xs text-forest">
              2
            </span>
            {MAX_ATTEMPTS} tries per quote — each wrong guess uses one.
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-900">
            <span className="shrink-0 w-6 h-6 rounded-full bg-hint-bg flex items-center justify-center font-serif text-xs text-forest">
              3
            </span>
            Stuck? Tap "Get a hint" — it won't cost you a try.
          </li>
        </ul>

        <AnimatedButton onClick={onDismiss} className="mt-6 w-full py-3 rounded-xl text-sm">
          Let's play
        </AnimatedButton>
      </div>
    </Modal>
  )
}
