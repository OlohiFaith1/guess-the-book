import { useState, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import PhoneFrame from "./components/PhoneFrame"
import LoadingScreen from "./components/LoadingScreen"
import GameScreen from "./components/GameScreen"
import CompletionScreen from "./components/CompletionScreen"
import ShareModal from "./components/ShareModal"
import AddLineModal from "./components/AddLineModal"
import SuccessToast from "./components/SuccessToast"
import { useGameState } from "./hooks/useGameState"
import { quotes as initialQuotes } from "./data/quotes"

/** App screens: loading → playing → complete */
const SCREENS = {
  LOADING: "loading",
  GAME: "game",
  COMPLETE: "complete",
}

/**
 * Top-level app component.
 * Owns the master quote list so Add Line updates are immediately playable.
 */
export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOADING)
  const [allQuotes, setAllQuotes] = useState(initialQuotes)
  const [shareOpen, setShareOpen] = useState(false)
  const [addLineOpen, setAddLineOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const game = useGameState(allQuotes)

  // Switch to completion screen when the game finishes
  useEffect(() => {
    if (game.isComplete) {
      setScreen(SCREENS.COMPLETE)
    }
  }, [game.isComplete])

  const handleLoadingComplete = useCallback(() => {
    setScreen(SCREENS.GAME)
  }, [])

  /** Add a new quote to the master list and the active game session. */
  const handleAddQuote = (newQuote) => {
    setAllQuotes((prev) => [...prev, newQuote])
    game.appendQuote(newQuote)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2800)
  }

  const handleRestart = () => {
    game.restart(allQuotes)
    setScreen(SCREENS.GAME)
  }

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        {screen === SCREENS.LOADING && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {screen === SCREENS.GAME && (
          <GameScreen
            key="game"
            game={game}
            onShare={() => setShareOpen(true)}
            onAddLine={() => setAddLineOpen(true)}
          />
        )}

        {screen === SCREENS.COMPLETE && (
          <CompletionScreen
            key="complete"
            score={game.score}
            total={game.totalQuotes}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <AddLineModal
        isOpen={addLineOpen}
        onClose={() => setAddLineOpen(false)}
        onSubmit={handleAddQuote}
      />
      <SuccessToast message="Line added — it’s now in your game!" visible={toastVisible} />
    </PhoneFrame>
  )
}
