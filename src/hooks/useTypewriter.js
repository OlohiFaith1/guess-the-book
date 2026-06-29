import { useState, useEffect, useRef } from "react"

/**
 * Types out text character by character.
 * Calls onCharacter for each new letter (useful for typewriter sounds).
 */
export function useTypewriter(
  text,
  { speed = 42, startDelay = 400, enabled = true, onCharacter } = {},
) {
  const [displayed, setDisplayed] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const onCharacterRef = useRef(onCharacter)
  onCharacterRef.current = onCharacter

  useEffect(() => {
    if (!enabled) return

    setDisplayed("")
    setIsComplete(false)

    let index = 0
    let intervalId

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        onCharacterRef.current?.(text[index - 1], index)

        if (index >= text.length) {
          clearInterval(intervalId)
          setIsComplete(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, speed, startDelay, enabled])

  return { displayed, isComplete }
}
