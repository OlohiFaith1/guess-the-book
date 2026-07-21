import { supabase, isSupabaseConfigured } from "./supabaseClient"

/**
 * Submit a community quote for review. Always lands as 'pending' — the
 * database policy enforces this too, so this can never sneak a quote
 * straight into the approved pool. Approval happens manually, later, in
 * the Supabase Table Editor; an AI hint is generated automatically once
 * approved (see the generate-hint Edge Function).
 */
export async function submitQuote({ quote, bookTitle, author }) {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Submissions aren't set up yet — ask the site owner to finish the Supabase setup (see SUPABASE_SETUP.md).",
    )
  }

  const { error } = await supabase.from("quote_submissions").insert({
    quote,
    book_title: bookTitle,
    author,
    status: "pending",
  })

  if (error) throw error
}

/**
 * Fetch community quotes that are approved AND already have an AI-generated
 * hint ready — anything still pending review or awaiting hint generation is
 * excluded automatically by the table's RLS policy, but we double-check
 * `hint` here too since that's what gameplay actually needs.
 */
export async function fetchApprovedQuotes() {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from("quote_submissions")
    .select("quote, book_title, author, hint")
    .eq("status", "approved")
    .not("hint", "is", null)
    .order("created_at", { ascending: false })

  if (error) {
    // eslint-disable-next-line no-console
    console.warn("[Supabase] Failed to fetch approved quotes:", error.message)
    return []
  }

  return data.map((row) => ({
    quote: row.quote,
    answer: row.book_title,
    author: row.author,
    hint: row.hint,
  }))
}
