# Community submissions + AI hints — setup guide

This wires up "Add your line" to save real submissions to Supabase, and
auto-generates a gameplay hint with Claude the moment you approve one. The
Supabase MCP connector wasn't available when this was built, so it's all
manual — but it's about 15 minutes, all through the Supabase dashboard.

## 1. Create a Supabase project (skip if you already have one)

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**.
2. Pick an organization, name it (e.g. `guess-the-book`), set a database
   password (save it somewhere), pick a region, and create it. Takes ~2 min
   to provision.

## 2. Run the table migration

1. In your project, open **SQL Editor** (left sidebar).
2. Open `supabase/migrations/20260721000000_create_quote_submissions.sql`
   from this repo, copy its full contents, paste into the SQL Editor.
3. Click **Run**. You should see `Success. No rows returned`.
4. Check **Table Editor** → you should now see a `quote_submissions` table
   with columns: `id`, `quote`, `book_title`, `author`, `status`, `hint`,
   `difficulty`, `genre`, `hint_generated_at`, `created_at`.

## 3. Connect the app to your project

1. In Supabase, go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon / public** key (not the
   `service_role` one — that one stays server-side only).
3. In this repo, copy `.env.example` to `.env` and fill in both values:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Run `npm install` (picks up the new `@supabase/supabase-js` dependency),
   then `npm run dev`. Submitting a line via "Add your line" should now
   create a row in `quote_submissions` with `status = pending`.

## 4. Get an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com) → **API
   Keys** → create one. Copy it — you won't see it again.

## 5. Deploy the hint-generation Edge Function

This needs the [Supabase CLI](https://supabase.com/docs/guides/cli). From
your terminal, in this project folder:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref   # find this in Project Settings → General
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here
npx supabase functions deploy generate-hint
```

After deploying, copy the function's URL — it'll look like:
`https://your-project-ref.supabase.co/functions/v1/generate-hint`

## 6. Wire up the auto-trigger

This makes hint generation happen automatically the instant you approve a
submission — no manual step needed after this point.

1. In Supabase, go to **Database → Webhooks → Create a new hook**.
2. Name: `generate-hint-on-approval`.
3. Table: `quote_submissions`.
4. Events: check **Update** only.
5. Type: **Supabase Edge Functions**.
6. Edge Function: select `generate-hint`.
7. Save.

(If your Supabase project version only offers "HTTP Request" webhooks
instead of the native Edge Function type, use that instead — set the URL to
the function URL from step 5, method `POST`, and add an `Authorization:
Bearer <anon-or-service-role-key>` header so the request is accepted.)

## 7. Try it end to end

1. In the app, submit a line via "Add your line."
2. In Supabase **Table Editor → quote_submissions**, find the new row and
   change its `status` from `pending` to `approved`, then save.
3. Within a few seconds, refresh the row — `hint`, `difficulty`, and
   `genre` should be filled in automatically.
4. Reload the app — that quote is now eligible to appear in gameplay
   (fetched alongside the built-in curated quotes).

## How moderation works day to day

- New submissions always land as `pending` — nobody sees them in the game.
- To publish one: open **Table Editor → quote_submissions**, change its
  `status` to `approved`. The hint generates itself within seconds.
- To reject one: change `status` to `rejected` (or just leave it
  `pending` — either way it's excluded from gameplay).
- There's no admin UI by design (per the MVP scope) — the Table Editor
  *is* the moderation tool for now.

## If something's not working

- **Submissions aren't saving**: check the browser console for the
  "Supabase is not configured" warning — means `.env` isn't set up or the
  dev server needs a restart after adding it.
- **Hints aren't generating**: check **Edge Functions → generate-hint →
  Logs** in the Supabase dashboard for the error. Common causes: the
  `ANTHROPIC_API_KEY` secret isn't set, or the webhook isn't configured to
  fire on `Update`.
- **A submission is stuck with no hint**: you can always trigger it by
  hand — in **SQL Editor**, run:
  ```sql
  update quote_submissions set status = 'pending' where id = 'the-row-id';
  update quote_submissions set status = 'approved' where id = 'the-row-id';
  ```
  Flipping it back and forth re-fires the webhook.
