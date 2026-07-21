import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Whether Supabase is actually configured. The app works fine without it —
 * it just falls back to the built-in curated quotes and disables community
 * submissions — so nothing crashes if these env vars are missing.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — " +
      "community quote submissions and approved-quote fetching are disabled. " +
      "See SUPABASE_SETUP.md to enable them.",
  )
}

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
