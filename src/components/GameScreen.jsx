import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ProgressGrid from "./ProgressGrid"
import QuoteCard from "./QuoteCard"
import AttemptsIndicator from "./AttemptsIndicator"
import HintButton from "./HintButton"
import BottomActions from "./BottomActions"
import { useSound } from "../contexts/SoundContext"
import { fadeUp } from "../animations/motionVariants"

/** Main game screen — assembles all gameplay UI pieces. */
export default function GameScreen({ game, onShare, onAddLine }) {
  const {
    currentQuote,
    currentIndex,
    totalQuotes,
    attemptsLeft,
    maxAttempts,
    hintVisible,
    answerRevealed,
    isCelebrating,
    guess,
    setGuess,
    feedback,
    shakeInput,
    submitGuess,
    skipQuote,
    showHint,
    continueAfterReveal,
  } = game

  const { playCorrect, playIncorrect, playHint, playPageTurn } = useSound()

  const prevIndex = useRef(currentIndex)
  const prevHint = useRef(hintVisible)
  const prevShake = useRef(shakeInput)

  // Page-turn sound when advancing to the next quote
  useEffect(() => {
    if (currentIndex > prevIndex.current) {
      playPageTurn()
    }
    prevIndex.current = currentIndex
  }, [currentIndex, playPageTurn])

  // Correct answer sound
  useEffect(() => {
    if (isCelebrating) playCorrect()
  }, [isCelebrating, playCorrect])

  // Incorrect guess sound
  useEffect(() => {
    if (shakeInput && !prevShake.current) playIncorrect()
    prevShake.current = shakeInput
  }, [shakeInput, playIncorrect])

  // Hint reveal sound
  useEffect(() => {
    if (hintVisible && !prevHint.current) playHint()
    prevHint.current = hintVisible
  }, [hintVisible, playHint])

  if (!currentQuote) return null

  return (
    <motion.div
      className="flex-1 flex flex-col min-h-0 overflow-y-auto"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <ProgressGrid
        current={currentIndex}
        total={totalQuotes}
        onSkip={skipQuote}
      />

      <QuoteCard
        quoteKey={currentIndex}
        quote={currentQuote.quote}
        hint={currentQuote.hint}
        hintVisible={hintVisible}
        guess={guess}
        onGuessChange={setGuess}
        onSubmit={submitGuess}
        disabled={answerRevealed || isCelebrating}
        feedback={feedback}
        isCelebrating={isCelebrating}
        answerRevealed={answerRevealed}
        onContinue={continueAfterReveal}
        revealedAnswer={currentQuote.answer}
        revealedAuthor={currentQuote.author}
        shakeInput={shakeInput}
      />

      {!answerRevealed && !isCelebrating && (
        <div className="px-5">
          <AttemptsIndicator
            attemptsLeft={attemptsLeft}
            maxAttempts={maxAttempts}
          />
          <HintButton onClick={showHint} hintVisible={hintVisible} />
        </div>
      )}

      <BottomActions onShare={onShare} onAddLine={onAddLine} />
    </motion.div>
  )
}
