# MindArena — Backend Contracts

## Source of truth vs. inferred

Confirmed from your 3 supplied workflows (already implemented in n8n, unchanged here):

| Action | Method | Path | Notes |
|---|---|---|---|
| Generate quiz | POST | `/generate-quiz` | Body: `{ topic, difficulty, number_of_questions }`. Creates a `quizzes` row + `questions` rows. Returns `{ success, message, quiz_id }`. |
| Get quiz | POST | `/get-quiz` | Body: `{ id }` (quiz id, read from `$json.query.id` in your workflow — sent as query param `?id=`). Returns `{ quiz, questions[] }` **including `correct_answer`**. |
| AI feedback | POST | `/ai-feedback` | Body: `{ topic, difficulty, score, total_questions, percentage }`. Returns `{ overall_performance, strengths, areas_to_improve, practical_suggestion }`. |

Everything below this line is **not** defined by any file you supplied. `Workflow4.json` turned out to contain your project brief text, not an n8n export — so no Arena/room workflow was actually provided. These 7 contracts are my design, built to match the `rooms` / `room_players` / `contest_results` schema and the response conventions of your 3 real workflows. **You still need to build these as n8n workflows.** Field names/paths are mine to change if they don't fit how you want to build them.

Important constraint I followed: `/get-contest` never returns `correct_answer` or `explanation` (unlike `/get-quiz`, which is fine to expose since it's only used for the practice mode, post-generation). Scoring happens only in `/submit-result`.

---

## 1. `POST /create-room`
Creates a room, generates its quiz (server-side, reusing the same generation logic as `/generate-quiz`), and registers the host as the first player.

**Request**
```json
{
  "topic": "Python",
  "difficulty": "Medium",
  "number_of_questions": 5,
  "max_players": 6,
  "host_id": "uuid",
  "player_name": "Jeswin"
}
```

**Response 200**
```json
{
  "success": true,
  "room": {
    "id": "uuid",
    "room_code": "7F3K2Q",
    "host_id": "uuid",
    "quiz_id": 12,
    "topic": "Python",
    "difficulty": "Medium",
    "number_of_questions": 5,
    "max_players": 6,
    "status": "waiting",
    "created_at": "..."
  }
}
```

---

## 2. `POST /join-room`
**Request**: `{ "room_code": "7F3K2Q", "user_id": "uuid", "player_name": "Jane" }`

**Response 200**: `{ "success": true, "room": {...}, "player": {...} }`

**Error responses** (still HTTP 200, `success:false`, so the frontend can read `error_code`):
```json
{ "success": false, "error_code": "ROOM_NOT_FOUND", "message": "No room with that code." }
{ "success": false, "error_code": "ROOM_FULL", "message": "This room is full." }
{ "success": false, "error_code": "ALREADY_STARTED", "message": "This contest has already started." }
{ "success": false, "error_code": "DUPLICATE_PLAYER", "message": "You already joined this room." }
```
(`DUPLICATE_PLAYER` is naturally enforceable via the `room_players_room_id_user_id_key` unique constraint — on a unique-violation, the workflow should catch it and return this instead of a raw DB error.)

---

## 3. `POST /get-room`
Polled by the lobby (and by players waiting for the host to start).

**Request**: `{ "room_id": "uuid" }` (or `{ "room_code": "..." }`)

**Response 200**
```json
{
  "success": true,
  "room": { "id": "...", "room_code": "...", "status": "waiting", "host_id": "...", "topic": "...", "difficulty": "...", "number_of_questions": 5, "max_players": 6 },
  "players": [
    { "id": "uuid", "user_id": "uuid", "player_name": "Jeswin", "is_host": true, "joined_at": "..." }
  ]
}
```

---

## 4. `POST /start-contest`
**Request**: `{ "room_id": "uuid", "host_id": "uuid" }`

Workflow must verify `host_id === rooms.host_id` before flipping `status` to `started`.

**Response 200**: `{ "success": true, "room": {...} }`
**Error**: `{ "success": false, "error_code": "UNAUTHORIZED_HOST", "message": "Only the host can start the contest." }`

---

## 5. `POST /get-contest`
Fetches the room's questions **without answers**, once `status = 'started'`.

**Request**: `{ "room_id": "uuid", "user_id": "uuid" }`

**Response 200**
```json
{
  "success": true,
  "room": { "id": "...", "status": "started", "topic": "...", "difficulty": "...", "number_of_questions": 5 },
  "questions": [
    { "id": 101, "question": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "..." }
  ]
}
```
**Error**: `{ "success": false, "error_code": "NOT_STARTED", "message": "The host hasn't started the contest yet." }`

---

## 6. `POST /submit-result`
Server-side scoring. The workflow fetches the real questions (with `correct_answer`) for `rooms.quiz_id`, compares against submitted answers, computes `score`/`percentage`, and upserts into `contest_results` (unique on `room_id`+`user_id`, matching your schema).

**Request**
```json
{
  "room_id": "uuid",
  "user_id": "uuid",
  "player_name": "Jeswin",
  "completion_time_seconds": 87,
  "answers": [ { "question_id": 101, "selected_answer": "Option text" } ]
}
```

**Response 200**
```json
{
  "success": true,
  "result": {
    "score": 4,
    "total_questions": 5,
    "percentage": 80.00,
    "completion_time_seconds": 87
  },
  "review": [
    { "question_id": 101, "question": "...", "your_answer": "...", "correct_answer": "...", "is_correct": true, "explanation": "..." }
  ]
}
```

---

## 7. `POST /get-leaderboard`
**Request**: `{ "room_id": "uuid" }`

**Response 200**
```json
{
  "success": true,
  "room": { "id": "...", "topic": "...", "difficulty": "...", "status": "completed" },
  "leaderboard": [
    { "rank": 1, "player_name": "Jeswin", "score": 5, "total_questions": 5, "percentage": 100.00, "completion_time_seconds": 61 }
  ]
}
```
Ranking: `percentage DESC, completion_time_seconds ASC`.

---

## Auth (inferred, not in any supplied workflow)

`profiles.id` defaults to `auth.uid()`, which is the standard Supabase-Auth pattern. I'm wiring the frontend to call **Supabase Auth directly** (Google OAuth via `supabase-js`), and inserting a `profiles` row on first login. All 7 webhooks above take a plain `user_id`/`host_id` string — swap this for a signed JWT check inside n8n if you want the webhooks themselves to verify the session server-side; right now they trust the `user_id` sent from the frontend, which is fine for a contest app but worth hardening later.
