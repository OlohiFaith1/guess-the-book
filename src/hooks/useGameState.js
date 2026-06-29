import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { isCorrectGuess } from "../utils/normalize"
import { shuffleArray } from "../utils/shuffle"
import { QUOTES_PER_ROUND, MAX_ATTEMPTS } from "../constants/game"

/**
 * Builds the quote list for one game round.
 * First game uses file order; restarts shuffle so added quotes can appear.
 */
function buildSessionQuotes(allQuotes, { shuffle = false } = {}) {
  const pool = shuffle ? shuffleArray(allQuotes) : [...allQuotes]
  return pool.slice(0, Math.min(QUOTES_PER_ROUND, pool.length))
}

/**
 * Custom hook that holds all game state and logic.
 * Receives the master quote list from App so Add Line updates flow through.
 */
export function useGameState(allQuotes) {
  const [sessionQuotes, setSessionQuotes] = useState(() => buildSessionQuotes(allQuotes))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
  const [hintVisible, setHintVisible] = useState(false)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [guess, setGuess] = useState("")
  const [feedback, setFeedback] = useState("")
  const [shakeInput, setShakeInput] = useState(false)

  const celebrateTimer = useRef(null)

  const currentQuote = sessionQuotes[currentIndex]
  const isLastQuote = currentIndex >= sessionQuotes.length - 1

  // Clean up celebration timer on unmount
  useEffect(() => {
    return () => {
      if (celebrateTimer.current) clearTimeout(celebrateTimer.current)
    }
  }, [])

  /** Reset per-quote state when moving to the next quote. */
  const resetQuoteState = useCallback(() => {
    setAttemptsLeft(MAX_ATTEMPTS)
    setHintVisible(false)
    setAnswerRevealed(false)
    setIsCorrect(false)
    setIsCelebrating(false)
    setGuess("")
    setFeedback("")
    setShakeInput(false)
  }, [])

  /** Move to the next quote, or show the completion screen. */
  const advanceQuote = useCallback(() => {
    if (isLastQuote) {
      setIsComplete(true)
    } else {
      setCurrentIndex((i) => i + 1)
      resetQuoteState()
    }
  }, [isLastQuote, resetQuoteState])

  /** Check the user's guess against the book answer. */
  const submitGuess = useCallback(() => {
    if (!guess.trim() || isCorrect || answerRevealed || isCelebrating || !currentQuote) return

    if (isCorrectGuess(guess, currentQuote.answer)) {
      setIsCorrect(true)
      setIsCelebrating(true)
      setScore((s) => s + 1)
      setFeedback("Correct! Well done.")

      celebrateTimer.current = setTimeout(() => {
        setIsCelebrating(false)
        advanceQuote()
      }, 1600)
      return
    }

    const remaining = attemptsLeft - 1
    setAttemptsLeft(remaining)
    setGuess("")
    setShakeInput(true)
    setTimeout(() => setShakeInput(false), 500)

    if (remaining === 0) {
      setAnswerRevealed(true)
      setFeedback(
        `The answer was "${currentQuote.answer}" by ${currentQuote.author}.`,
      )
    } else {
      setFeedback(
        `Not quite. ${remaining} attempt${remaining === 1 ? "" : "s"} left.`,
      )
    }
  }, [
    guess,
    isCorrect,
    answerRevealed,
    isCelebrating,
    currentQuote,
    attemptsLeft,
    advanceQuote,
  ])

  /** Skip the current quote without scoring. */
  const skipQuote = useCallback(() => {
    if (isCelebrating) return
    advanceQuote()
  }, [isCelebrating, advanceQuote])

  /** Reveal the hint for the current quote. */
  const showHint = useCallback(() => {
    setHintVisible(true)
  }, [])

  /** Continue after the answer has been revealed. */
  const continueAfterReveal = useCallback(() => {
    advanceQuote()
  }, [advanceQuote])

  /**
   * Add a user-submitted quote to the active session.
   * Makes new lines playable immediately without a refresh.
   */
  const appendQuote = useCallback(
    (newQuote) => {
      if (isComplete) return

      setSessionQuotes((prev) => {
        // Avoid duplicates by matching quote text
        if (prev.some((q) => q.quote === newQuote.quote)) return prev
        return [...prev, newQuote]
      })
    },
    [isComplete],
  )

  /** Restart the entire game from quote 1. */
  const restart = useCallback(
    (freshQuotes) => {
      if (celebrateTimer.current) clearTimeout(celebrateTimer.current)
      setSessionQuotes(buildSessionQuotes(freshQuotes, { shuffle: true }))
      setCurrentIndex(0)
      setScore(0)
      setIsComplete(false)
      resetQuoteState()
    },
    [resetQuoteState],
  )

  const totalQuotes = useMemo(() => sessionQuotes.length, [sessionQuotes])

  return {
    sessionQuotes,
    currentQuote,
    currentIndex,
    totalQuotes,
    score,
    attemptsLeft,
    maxAttempts: MAX_ATTEMPTS,
    hintVisible,
    answerRevealed,
    isCorrect,
    isCelebrating,
    isComplete,
    guess,
    setGuess,
    feedback,
    shakeInput,
    submitGuess,
    skipQuote,
    showHint,
    continueAfterReveal,
    appendQuote,
    restart,
  }
}
