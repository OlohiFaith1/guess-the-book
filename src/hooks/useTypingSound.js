import { useCallback } from "react"

const IGNORED_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "Tab",
  "Escape",
  "CapsLock",
  "Backspace",
  "Delete",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
])

/**
 * Returns a keydown handler that plays a subtle keyboard sound per real keystroke.
 * Ignores modifier keys and does not fire on programmatic input changes.
 */
export function useTypingKeyDown(playKeyboardType, { enabled, ready }) {
  return useCallback(
    (e) => {
      if (!enabled || !ready) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (IGNORED_KEYS.has(e.key)) return
      // Only play for keys that actually insert characters
      if (e.key.length !== 1) return

      playKeyboardType()
    },
    [playKeyboardType, enabled, ready],
  )
}
