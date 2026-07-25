import { useCallback, useState } from "react"

/**
 * Tracks a one-time onboarding moment (a welcome card, an inline tip) so it
 * only ever shows once per player, persisted in localStorage. Returns
 * [shouldShow, dismiss].
 */
export function useFirstRun(key) {
  const [shouldShow, setShouldShow] = useState(() => {
    try {
      return localStorage.getItem(key) !== "true"
    } catch {
      return false
    }
  })

  const dismiss = useCallback(() => {
    setShouldShow(false)
    try {
      localStorage.setItem(key, "true")
    } catch {
      // localStorage may be unavailable (private browsing etc.) — dismissal
      // still works for the rest of this session either way.
    }
  }, [key])

  return [shouldShow, dismiss]
}
