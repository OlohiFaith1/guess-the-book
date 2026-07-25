import typewriterKey from "../../assets/sounds/typewriter-key.wav"
import typewriterComplete from "../../assets/sounds/typewriter-complete.wav"
import buttonClick from "../../assets/sounds/button-click.wav"
import keyboardType from "../../assets/sounds/keyboard-type.wav"
import correct from "../../assets/sounds/correct.wav"
import incorrect from "../../assets/sounds/incorrect.wav"
import hint from "../../assets/sounds/hint.wav"
import pageTurn from "../../assets/sounds/page-turn.wav"
import completion from "../../assets/sounds/completion.wav"

/** Sound effect names and their source files. */
export const SOUND_FILES = {
  typewriterKey,
  typewriterComplete,
  buttonClick,
  keyboardType,
  correct,
  incorrect,
  hint,
  pageTurn,
  completion,
}

const STORAGE_KEY = "guess-the-book-sound-enabled"
const DEFAULT_VOLUME = 0.2

/** Minimum ms between playing the same sound (prevents overlap noise). */
const THROTTLE_MS = {
  typewriterKey: 30,
  keyboardType: 55,
  buttonClick: 80,
  default: 100,
}

class SoundManager {
  constructor() {
    this.sounds = {}
    this.enabled = this.loadEnabled()
    this.volume = DEFAULT_VOLUME
    this.unlocked = false
    this.lastPlayed = {}
    this.preloaded = false
    this.loadErrors = []

    this._bindUnlock()
  }

  loadEnabled() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      // Sound defaults to OFF on a first visit — players opt in via the toggle.
      return stored === null ? false : stored === "true"
    } catch {
      return false
    }
  }

  saveEnabled(value) {
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // localStorage may be unavailable
    }
  }

  setEnabled(value) {
    this.enabled = value
    this.saveEnabled(value)
  }

  isEnabled() {
    return this.enabled
  }

  isPreloaded() {
    return this.preloaded
  }

  getLoadErrors() {
    return this.loadErrors
  }

  /** Unlock audio after first user interaction (browser autoplay policy). */
  _bindUnlock() {
    const unlock = async () => {
      this.unlocked = true
      document.removeEventListener("pointerdown", unlock)
      document.removeEventListener("keydown", unlock)

      // Resume any suspended audio by playing a silent burst
      try {
        const template = this.sounds.buttonClick
        if (template) {
          const audio = template.cloneNode()
          audio.volume = 0.001
          await audio.play()
          audio.pause()
        }
      } catch {
        // Still unlocked — subsequent plays may work
      }
    }
    document.addEventListener("pointerdown", unlock, { once: true })
    document.addEventListener("keydown", unlock, { once: true })
  }

  async preload() {
    if (this.preloaded) return

    this.loadErrors = []

    await Promise.all(
      Object.entries(SOUND_FILES).map(
        ([name, src]) =>
          new Promise((resolve) => {
            const audio = new Audio(src)
            audio.preload = "auto"
            audio.volume = this.volume

            const finish = (failed = false) => {
              if (failed) {
                this.loadErrors.push(name)
                console.error(`[Sound] Failed to load: "${name}" from ${src}`)
              }
              this.sounds[name] = failed ? null : audio
              resolve()
            }

            audio.addEventListener("canplaythrough", () => finish(false), { once: true })
            audio.addEventListener("error", () => finish(true), { once: true })
            audio.load()
          }),
      ),
    )

    this.preloaded = true

    if (this.loadErrors.length > 0) {
      console.warn(
        `[Sound] Missing sounds: ${this.loadErrors.join(", ")}`,
      )
    }
  }

  _canPlay(name) {
    if (!this.enabled) return false
    if (!this.sounds[name]) {
      console.warn(`[Sound] Sound not available: "${name}"`)
      return false
    }

    const throttle = THROTTLE_MS[name] ?? THROTTLE_MS.default
    const now = Date.now()
    if (now - (this.lastPlayed[name] ?? 0) < throttle) return false

    this.lastPlayed[name] = now
    return true
  }

  /**
   * Play a sound effect.
   * Returns true if playback started, false otherwise.
   */
  play(name, { rate = 1, volume } = {}) {
    if (!this._canPlay(name)) return false

    const template = this.sounds[name]
    const audio = template.cloneNode()
    audio.volume = volume ?? this.volume
    audio.playbackRate = rate

    audio.play().catch((err) => {
      if (!this.unlocked) {
        console.warn(
          `[Sound] Playback blocked for "${name}" — waiting for user interaction.`,
        )
      } else {
        console.warn(`[Sound] Playback failed for "${name}":`, err.message)
      }
    })

    return true
  }

  playTypewriterKey() {
    const rate = 0.95 + Math.random() * 0.1 // ±5%
    return this.play("typewriterKey", { rate, volume: 0.2 })
  }

  playKeyboardType() {
    const rate = 0.95 + Math.random() * 0.1
    return this.play("keyboardType", { rate, volume: 0.2 })
  }

  playButtonClick() {
    return this.play("buttonClick")
  }
}

/** Singleton sound manager — import and use anywhere. */
export const soundManager = new SoundManager()
