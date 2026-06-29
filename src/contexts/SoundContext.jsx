import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { soundManager } from "../utils/sounds/soundManager"

const SoundContext = createContext(null)

/**
 * Provides sound controls and play functions to the whole app.
 * Preloads all sounds immediately on mount.
 */
export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => soundManager.isEnabled())
  const [ready, setReady] = useState(() => soundManager.isPreloaded())

  // Preload sounds as soon as the app mounts — before the typewriter starts
  useEffect(() => {
    if (soundManager.isPreloaded()) {
      setReady(true)
      return
    }

    soundManager.preload().then(() => {
      setReady(true)
    })
  }, [])

  useEffect(() => {
    soundManager.setEnabled(enabled)
  }, [enabled])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      soundManager.setEnabled(next)
      return next
    })
  }, [])

  const play = useCallback((name, options) => {
    soundManager.play(name, options)
  }, [])

  const value = useMemo(
    () => ({
      enabled,
      ready,
      toggle,
      play,
      playTypewriterKey: () => soundManager.playTypewriterKey(),
      playKeyboardType: () => soundManager.playKeyboardType(),
      playButtonClick: () => soundManager.playButtonClick(),
      playCorrect: () => soundManager.play("correct"),
      playIncorrect: () => soundManager.play("incorrect"),
      playHint: () => soundManager.play("hint"),
      playPageTurn: () => soundManager.play("pageTurn"),
      playCompletion: () => soundManager.play("completion"),
      playTypewriterComplete: () => soundManager.play("typewriterComplete"),
    }),
    [enabled, ready, toggle, play],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return ctx
}
