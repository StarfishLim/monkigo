# Monkey Hunt

Mobile-first exploration game for discovering hidden monkey artworks at Upper Thomson MRT station (Singapore).

## Tech stack
- Next.js (Pages Router)
- React
- Tailwind CSS
- Supabase (Auth + DB)

## Getting started
1. Install dependencies:

```bash
npm install
```

2. Add env vars in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run dev server:

```bash
npm run dev
```

## Notes
- The app works offline-first with localStorage for progress (`monkey-hunt-progress`).
- If Supabase env vars are set and the user is logged in, unlocks are also synced to `user_progress`.

## Suggested Supabase schema
Tables:
- `profiles` (id uuid pk references auth.users, username text, avatar_url text)
- `zones` (id text pk, name text, description text, icon text)
- `monkeys` (id text pk, zone_id text fk, name text, clue text, question text, options jsonb, correct_option_index int, icon text)
- `user_progress` (id uuid pk default gen_random_uuid(), user_id uuid, monkey_id text, unlocked_at timestamptz, unique(user_id, monkey_id))

