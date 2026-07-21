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
import { quotes as curatedQuotes } from "./data/quotes"
import { submitQuote, fetchApprovedQuotes } from "./lib/quoteSubmissions"

/** App screens: loading → playing → complete */
const SCREENS = {
  LOADING: "loading",
  GAME: "game",
  COMPLETE: "complete",
}

/**
 * Top-level app component.
 * Owns the master quote list: curated quotes plus any approved (and
 * AI-hinted) community submissions fetched from Supabase.
 */
export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOADING)
  // Curated quotes ship with the app and are always available; approved
  // community submissions (with their AI-generated hint already attached)
  // are fetched once on load and merged in alongside them.
  const [allQuotes, setAllQuotes] = useState(curatedQuotes)
  const [shareOpen, setShareOpen] = useState(false)
  const [addLineOpen, setAddLineOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const game = useGameState(allQuotes)

  // Pull in approved + hinted community quotes once, on load.
  useEffect(() => {
    let cancelled = false

    fetchApprovedQuotes().then((communityQuotes) => {
      if (cancelled || communityQuotes.length === 0) return
      setAllQuotes([...curatedQuotes, ...communityQuotes])
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Switch to completion screen when the game finishes
  useEffect(() => {
    if (game.isComplete) {
      setScreen(SCREENS.COMPLETE)
    }
  }, [game.isComplete])

  const handleLoadingComplete = useCallback(() => {
    setScreen(SCREENS.GAME)
  }, [])

  /**
   * Submit a community line for review. It's stored as 'pending' and does
   * NOT appear in this or anyone else's game immediately — only after it's
   * manually approved and has an AI-generated hint attached.
   */
  const handleAddQuote = async ({ quote, bookTitle, author }) => {
    await submitQuote({ quote, bookTitle, author })
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3200)
  }

  const handleRestart = () => {
    game.restart(allQuotes)
    setScreen(SCREENS.GAME)
  }

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
            onShare={() => setShareOpen(true)}
            onAddLine={() => setAddLineOpen(true)}
          />
        )}
        </AnimatePresence>
      </div>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <AddLineModal
        isOpen={addLineOpen}
        onClose={() => setAddLineOpen(false)}
        onSubmit={handleAddQuote}
      />
      <SuccessToast
        message="Thanks! Your line is in for review — we'll add it once it's approved."
        visible={toastVisible}
      />
    </PhoneFrame>
  )
}
