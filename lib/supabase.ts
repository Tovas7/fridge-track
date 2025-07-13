import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ---------------------------------------------------------------------------
// If env vars are missing (e.g. in the v0 preview) fall back to a dummy
// Supabase project so the app doesn’t crash.  You MUST replace these with
// your real credentials in local development / production.
// ---------------------------------------------------------------------------
function getFallbackClient(): SupabaseClient<any, "public", any> {
  console.warn(
    "⚠️  Missing Supabase env vars. Using fallback client. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
      "to connect to your own Supabase project.",
  )
  // This public demo DB is read-only and safe for previews.
  return createClient("https://demo.supabase.co", "public-anon-key")
}

export const supabase: SupabaseClient = url && anon ? createClient(url, anon) : getFallbackClient()

// ---------------------------------------------------------------------------
// Re-export TypeScript helper types so other files keep working.
// ---------------------------------------------------------------------------
export type { Profile, FoodItem, Notification } from "./supabase"
