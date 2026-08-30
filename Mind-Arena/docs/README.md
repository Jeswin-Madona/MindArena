# MindArena — AI-Powered Quiz Battles

React + Vite + Tailwind frontend for a real-time multiplayer quiz contest platform, plus a secondary solo Practice mode.

## ⚠️ Read this first

3 of your 4 uploaded files were real n8n workflow exports (`Workflow1.json` = generate quiz, `Workflow2.json` = get quiz, `Workflow3.json` = AI feedback). **`Workflow4.json` turned out to be your project brief text, not a workflow** — so no backend for rooms/lobby/contest/leaderboard was actually supplied.

Those 7 Arena operations (`createRoom`, `joinRoom`, `getRoom`, `startContest`, `getContest`, `submitResult`, `getLeaderboard`) are implemented here against contracts **I designed** to match your Supabase schema — see **`API_CONTRACTS.md`** for the full request/response spec of every endpoint, and which 3 are real vs. inferred. You'll need to build the 7 inferred ones as n8n workflows (or point `src/lib/api.js` at whatever paths/shapes you end up building instead).

Auth is also inferred: nothing in your files handles login, but `profiles.id` defaults to `auth.uid()`, which is the standard signature of Supabase Auth. This app calls Supabase's Google OAuth directly from the frontend rather than through n8n.

## Setup

```bash
npm install
cp .env.example .env   # fill in your Supabase project + n8n base URL
npm run dev
```

You'll also need, in your Supabase project:
- Google added as an auth provider (Authentication → Providers)
- Row Level Security policies on `profiles`, `rooms`, `room_players`, `contest_results` that allow the operations your n8n workflows perform (n8n typically uses the service role key, which bypasses RLS — but the frontend's direct `profiles` upsert on login uses the anon key + user session, so `profiles` needs an RLS policy allowing a user to insert/update their own row)

## Project structure

```
mindarena/
├── API_CONTRACTS.md          # full spec of every backend endpoint (real + inferred)
├── index.html
├── src/
│   ├── main.jsx               # app bootstrap: router + auth provider
│   ├── App.jsx                 # all routes
│   ├── index.css               # Tailwind + design tokens (see tailwind.config.js)
│   ├── lib/
│   │   ├── supabaseClient.js   # Supabase client (auth)
│   │   └── api.js              # every n8n webhook call, one place
│   ├── context/
│   │   └── AuthContext.jsx     # Google login/logout, current user
│   ├── components/
│   │   ├── common/              # LoadingSpinner, ErrorBanner, ProtectedRoute
│   │   ├── layout/Navbar.jsx
│   │   └── arena/                # RoomCodeBadge, PlayerList, Timer
│   └── pages/
│       ├── Login.jsx
│       ├── Home.jsx             # Arena hub: create / join / practice links
│       ├── arena/
│       │   ├── CreateRoom.jsx
│       │   ├── JoinRoom.jsx
│       │   ├── Lobby.jsx         # polls room state, host starts contest
│       │   ├── LiveContest.jsx   # question flow + timer, submits to server
│       │   ├── ContestResults.jsx
│       │   └── Leaderboard.jsx   # polls ranked results
│       └── practice/
│           ├── PracticeGenerate.jsx
│           ├── PracticeQuiz.jsx   # client-scored (no submit workflow was in scope)
│           └── PracticeResults.jsx # + AI feedback via /ai-feedback
```

25 files total (excluding config/build files).

## How multiplayer sync works

There's no websocket workflow in scope, so **Lobby** and **Leaderboard** poll `/get-room` and `/get-leaderboard` every 2.5s / 4s respectively. When the host calls `/start-contest`, every polling client picks up `status: 'started'` on its next poll and is routed into the live contest automatically — this is what makes it work across two separate browser sessions without any shared frontend state.

## Error handling

`src/lib/api.js` normalizes every failure (network error, non-2xx, or `{success:false}` body) into a single `ApiError`, so every page can show a consistent error banner with retry. Room-join edge cases (not found, full, already started, duplicate player) are expected to come back as `{ success:false, error_code, message }` per `API_CONTRACTS.md` — `JoinRoom.jsx` just surfaces `message` directly.
