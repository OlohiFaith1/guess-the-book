import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ProgressGrid from "./ProgressGrid"
import QuoteCard from "./QuoteCard"
import AttemptsIndicator from "./AttemptsIndicator"
import HintButton from "./HintButton"
import { useSound } from "../contexts/SoundContext"
import { fadeUp } from "../animations/motionVariants"

/** Main game screen — assembles all gameplay UI pieces. */
export default function GameScreen({ game, answerOptions }) {
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

  useEffect(() => {
    if (currentIndex > prevIndex.current) {
      playPageTurn()
    }
    prevIndex.current = currentIndex
  }, [currentIndex, playPageTurn])

  useEffect(() => {
    if (isCelebrating) playCorrect()
  }, [isCelebrating, playCorrect])

  useEffect(() => {
    if (shakeInput && !prevShake.current) playIncorrect()
    prevShake.current = shakeInput
  }, [shakeInput, playIncorrect])

  useEffect(() => {
    if (hintVisible && !prevHint.current) playHint()
    prevHint.current = hintVisible
  }, [hintVisible, playHint])

  if (!currentQuote) return null

  return (
    <motion.div
      className="flex-1 flex flex-col min-h-0 h-full overflow-hidden"
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

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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
          answerOptions={answerOptions}
        />

        {!answerRevealed && !isCelebrating && (
          <div className="shrink-0 px-5">
            <AttemptsIndicator
              attemptsLeft={attemptsLeft}
              maxAttempts={maxAttempts}
              showTipEligible={currentIndex === 0 && attemptsLeft === maxAttempts}
            />
            <HintButton onClick={showHint} hintVisible={hintVisible} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
