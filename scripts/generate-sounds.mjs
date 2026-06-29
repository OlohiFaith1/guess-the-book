/**
 * Generates lightweight WAV sound effects for the app.
 * Run: node scripts/generate-sounds.mjs
 */
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, "../src/assets/sounds")

mkdirSync(OUT_DIR, { recursive: true })

const SAMPLE_RATE = 22050

function writeWav(filename, samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2)
  buffer.write("RIFF", 0)
  buffer.writeUInt32LE(36 + samples.length * 2, 4)
  buffer.write("WAVE", 8)
  buffer.write("fmt ", 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(SAMPLE_RATE, 24)
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write("data", 36)
  buffer.writeUInt32LE(samples.length * 2, 40)

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2)
  }

  writeFileSync(join(OUT_DIR, filename), buffer)
}

function tone(freq, duration, volume = 0.3, type = "sine") {
  const n = Math.floor(SAMPLE_RATE * duration)
  const samples = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t * (type === "click" ? 40 : 6))
    let wave
    if (type === "sine") wave = Math.sin(2 * Math.PI * freq * t)
    else if (type === "click") wave = (Math.random() * 2 - 1) * Math.exp(-t * 80)
    else wave = Math.sin(2 * Math.PI * freq * t) * 0.6 + (Math.random() * 2 - 1) * 0.15
    samples[i] = wave * env * volume
  }
  return samples
}

function merge(...arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0)
  const out = new Float32Array(total)
  let offset = 0
  for (const arr of arrays) {
    out.set(arr, offset)
    offset += arr.length
  }
  return out
}

// Soft typewriter key click
writeWav("typewriter-key.wav", tone(1200, 0.025, 0.12, "click"))

// Subtle completion chime
writeWav(
  "typewriter-complete.wav",
  merge(tone(523, 0.12, 0.15), tone(659, 0.18, 0.12)),
)

// Gentle button tap
writeWav("button-click.wav", tone(600, 0.04, 0.18, "click"))

// Keyboard typing (quieter)
writeWav("keyboard-type.wav", tone(900, 0.02, 0.08, "click"))

// Positive correct answer
writeWav(
  "correct.wav",
  merge(tone(523, 0.1, 0.2), tone(659, 0.1, 0.18), tone(784, 0.2, 0.15)),
)

// Soft incorrect
writeWav("incorrect.wav", tone(180, 0.15, 0.15, "noise"))

// Hint / page flutter
writeWav("hint.wav", tone(300, 0.12, 0.12, "noise"))

// Page turn
writeWav("page-turn.wav", tone(250, 0.18, 0.14, "noise"))

// Completion celebration
writeWav(
  "completion.wav",
  merge(
    tone(392, 0.15, 0.18),
    tone(494, 0.15, 0.16),
    tone(587, 0.15, 0.14),
    tone(784, 0.3, 0.12),
  ),
)

console.log(`Generated ${OUT_DIR}`)
