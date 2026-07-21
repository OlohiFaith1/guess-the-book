// Supabase Edge Function: generate-hint
//
// Triggered by a Database Webhook on `public.quote_submissions` (UPDATE
// event) — see SUPABASE_SETUP.md for how to wire that up. When a submission
// is approved, this calls Claude to write a gameplay hint (and light
// metadata) and saves it back onto the row, so it never needs to be
// regenerated later.
//
// Required secrets (set via `supabase secrets set ...`):
//   ANTHROPIC_API_KEY        — your Anthropic API key
// Auto-provided by the Supabase runtime (no setup needed):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "jsr:@supabase/supabase-js@2"

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

interface QuoteRow {
  id: string
  quote: string
  book_title: string
  author: string
  status: string
  hint: string | null
}

interface WebhookPayload {
  type: string
  table: string
  record: QuoteRow
  old_record: QuoteRow | null
}

/** Ask Claude for a hint + light metadata, returned as strict JSON. */
async function generateHintData(row: QuoteRow) {
  const prompt = `You are writing a gameplay hint for a "guess the book from a quote" game.

A player has already seen this quote and is struggling to guess the book:
"${row.quote}"

The book is "${row.book_title}" by ${row.author}.

Write a short, natural hint (1-2 sentences, under 30 words) that nudges the
player toward the right answer WITHOUT ever naming the book title, the
author's full name, or directly quoting the passage. Reference things like
characters, setting, era, or theme — the way a friend would describe a book
they love without spoiling the title. Match this style:

"Four sisters — each very different — grow up together during the American Civil War."
"A hungry boy in a Victorian workhouse dares to ask for more food."

Also estimate a difficulty and genre for this quote.

Respond with ONLY a JSON object, no other text, in exactly this shape:
{"hint": "...", "difficulty": "easy" | "medium" | "hard", "genre": "..."}`

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Anthropic API error (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const text = data?.content?.[0]?.text ?? ""

  // Be defensive in case the model wraps the JSON in prose or code fences.
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`Could not find JSON in Claude's response: ${text}`)

  const parsed = JSON.parse(match[0])
  if (!parsed.hint || typeof parsed.hint !== "string") {
    throw new Error(`Claude's response was missing a valid "hint": ${text}`)
  }

  return {
    hint: parsed.hint.trim(),
    difficulty: ["easy", "medium", "hard"].includes(parsed.difficulty) ? parsed.difficulty : null,
    genre: typeof parsed.genre === "string" ? parsed.genre.trim() : null,
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  if (!ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY secret is not set")
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  let payload: WebhookPayload
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const { record, old_record } = payload

  // Only act on the moment a submission transitions INTO 'approved'. This
  // guard also prevents an infinite loop: once we write the hint back, the
  // row updates again, but by then old_record.status is already 'approved',
  // so this check fails and we skip straight out.
  const justApproved = record?.status === "approved" && old_record?.status !== "approved"

  if (!justApproved || record.hint) {
    return new Response(JSON.stringify({ skipped: true, reason: "not a new approval" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }

  try {
    const { hint, difficulty, genre } = await generateHintData(record)

    const { error } = await supabase
      .from("quote_submissions")
      .update({ hint, difficulty, genre, hint_generated_at: new Date().toISOString() })
      .eq("id", record.id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true, id: record.id, hint, difficulty, genre }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (err) {
    console.error(`Failed to generate hint for submission ${record.id}:`, err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
})
