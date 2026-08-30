# 🧠 MindArena - AI-Powered Quiz & Multiplayer Contest Platform

MindArena is a modern AI-powered quiz platform that combines **solo practice quizzes** with **real-time multiplayer quiz contests**.

Users can generate quizzes on any topic, practice individually, receive AI-generated feedback, create multiplayer contest rooms, invite other players using a room code, compete together, and view contest results and leaderboards.

The application uses a React frontend, Supabase for authentication and database management, and n8n workflows for backend automation and AI-powered quiz operations.

---

## ✨ Features

### 🎯 Practice Mode

- Generate AI-powered quizzes
- Select custom topics
- Choose difficulty levels
- Configure the number of questions
- Answer questions interactively
- View quiz results
- Receive AI-generated performance feedback
- Responsive quiz interface

---

### ⚔️ Multiplayer Contest Arena

- Create multiplayer quiz rooms
- Generate unique room codes
- Join contests using room codes
- Support multiple players
- Real-time lobby updates using polling
- Host-controlled contest start
- Synchronized contest experience
- Question timer
- Submit answers and results
- Contest results page
- Multiplayer leaderboard

---

### 🔐 Authentication

- User authentication using Supabase
- Secure session management
- Protected application routes
- User profile integration
- Login and logout functionality

---

### 🤖 AI Integration

MindArena uses n8n workflows to handle AI-powered operations such as:

- Quiz generation
- Quiz retrieval
- AI performance feedback
- Contest room management
- Contest question management
- Result submission
- Leaderboard generation

---

## 🏗️ Technology Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React Icons

### Backend & Automation

- n8n
- Webhooks
- Workflow automation

### Database & Authentication

- Supabase
- PostgreSQL
- Supabase Authentication

### Development

- JavaScript
- REST APIs
- Vite Development Proxy

---

# 📂 Project Structure

```text
mindarena/
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
├── src/
│   │
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── arena/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── supabaseClient.js
│   │
│   └── pages/
│       │
│       ├── Login.jsx
│       ├── Home.jsx
│       │
│       ├── arena/
│       │   ├── CreateRoom.jsx
│       │   ├── JoinRoom.jsx
│       │   ├── Lobby.jsx
│       │   ├── LiveContest.jsx
│       │   ├── ContestResults.jsx
│       │   └── Leaderboard.jsx
│       │
│       └── practice/
│           ├── PracticeGenerate.jsx
│           ├── PracticeQuiz.jsx
│           └── PracticeResults.jsx
│
├── workflows/
│   ├── Generate Quiz Workflow.json
│   ├── Get Quiz Workflow.json
│   ├── AI Feedback Workflow.json
│   └── MindArena Management.json
│
├── schemas/
│   └── Database Schema.sql
│
└── README.md
````

---

# 🔄 Application Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ React Frontend   │
                    │   + Vite         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Vite Proxy      │
                    │   /n8n/*         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │       n8n        │
                    │ Workflow Engine  │
                    └───────┬──────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌────────────────┐       ┌────────────────┐
      │ AI / Quiz Logic │       │   Supabase     │
      │   Workflows     │       │ Database/Auth  │
      └────────────────┘       └────────────────┘
```

---

# 🔌 n8n Workflow Architecture

MindArena communicates with n8n using webhook endpoints.

The frontend sends requests through a centralized API layer:

```text
src/lib/api.js
```

All API communication is handled from this file.

Example architecture:

```text
Frontend
   │
   ▼
api.createRoom()
   │
   ▼
POST /n8n/arena-management-test
   │
   ▼
Vite Proxy
   │
   ▼
n8n Webhook
   │
   ▼
Workflow Router
   │
   ├── createRoom
   ├── joinRoom
   ├── getRoom
   ├── startContest
   ├── getContest
   ├── submitResult
   └── getLeaderboard
```

---

# ⚔️ Multiplayer Contest Flow

## 1. Create Contest

The host creates a contest by providing:

* Topic
* Difficulty
* Number of questions
* Maximum players

Request example:

```json
{
  "action": "createRoom",
  "topic": "Python",
  "difficulty": "Medium",
  "number_of_questions": 5,
  "max_players": 6,
  "host_id": "user-id",
  "player_name": "Host Name"
}
```

The backend:

1. Generates a quiz
2. Creates a room
3. Generates a unique room code
4. Adds the host to `room_players`
5. Returns room information

---

## 2. Join Contest

Players join using the room code.

Example request:

```json
{
  "action": "joinRoom",
  "room_code": "ABC12345",
  "user_id": "player-id",
  "player_name": "Player Name"
}
```

The workflow validates:

* Room exists
* Contest has not started
* Room is not full
* User has not already joined

Then the player is added to the database.

---

## 3. Lobby Synchronization

The lobby periodically fetches room information.

```text
Host creates room
       │
       ▼
Player joins
       │
       ▼
Database updated
       │
       ▼
Lobby polls room state
       │
       ▼
Player list updates
```

Polling allows multiple browser sessions to stay synchronized without requiring WebSockets.

---

## 4. Start Contest

Only the host can start the contest.

The backend:

1. Validates the host
2. Updates room status
3. Loads contest questions
4. Makes the contest available to all players

Other players detect the status change during polling and automatically move to the contest screen.

---

## 5. Live Contest

During the contest:

* Questions are displayed sequentially
* Players select answers
* A timer tracks completion
* Answers are collected
* Results are submitted to the backend

Example:

```json
{
  "action": "submitResult",
  "room_id": "room-id",
  "user_id": "user-id",
  "player_name": "Player Name",
  "completion_time_seconds": 120,
  "answers": []
}
```

---

## 6. Leaderboard

After results are submitted, the leaderboard ranks players based on:

1. Score
2. Completion time

The leaderboard periodically refreshes to show updated rankings.

---

# 🗄️ Database Architecture

MindArena uses Supabase PostgreSQL.

Main tables include:

### `profiles`

Stores user profile information.

```text
id
username
full_name
avatar_url
created_at
```

---

### `rooms`

Stores multiplayer contest rooms.

```text
id
room_code
host_id
quiz_id
topic
difficulty
number_of_questions
max_players
status
created_at
```

---

### `room_players`

Stores players participating in a room.

```text
id
room_id
user_id
player_name
is_host
joined_at
```

---

### `contest_results`

Stores player contest results.

```text
id
room_id
user_id
score
completion_time_seconds
answers
created_at
```

---

# 🔐 Authentication

Authentication is handled using Supabase.

The application manages:

* User login
* Session persistence
* Logout
* Protected routes
* Current user information

Protected pages redirect unauthenticated users to the login screen.

---

# 🌐 Vite Proxy Configuration

During development, the frontend communicates with n8n through a Vite proxy.

Example:

```js
server: {
  port: 5173,
  proxy: {
    '/n8n': {
      target: 'http://localhost:5678',
      changeOrigin: true,
      secure: false,
      rewrite: (path) =>
        path.replace(/^\/n8n/, '/webhook'),
    },
  },
}
```

This allows the frontend to call:

```text
http://localhost:5173/n8n/...
```

while Vite forwards requests to:

```text
http://localhost:5678/webhook/...
```

This helps avoid browser CORS issues during local development.

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
cd mindarena
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file.

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Configure any additional environment variables required by your deployment.

> Never commit sensitive environment variables to GitHub.

---

## 4. Start n8n

Make sure your local n8n instance is running.

Default local URL:

```text
http://localhost:5678
```

---

## 5. Configure Workflows

Import the workflow JSON files from:

```text
workflows/
```

into your n8n instance.

Ensure all workflows are properly published and the webhook paths match the frontend API configuration.

---

## 6. Configure Supabase

Create the required database tables using the provided schema.

Configure:

* Supabase URL
* Anonymous key
* Authentication providers
* Row Level Security policies

---

## 7. Start the Frontend

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

---

# 📡 API Operations

The Arena Management workflow supports the following actions.

| Action           | Description                           |
| ---------------- | ------------------------------------- |
| `createRoom`     | Creates a multiplayer contest room    |
| `joinRoom`       | Adds a player to a room               |
| `getRoom`        | Retrieves room and player information |
| `startContest`   | Starts the contest                    |
| `getContest`     | Retrieves contest questions           |
| `submitResult`   | Submits player results                |
| `getLeaderboard` | Retrieves ranked contest results      |

---

# 🛠 Error Handling

All frontend API calls are centralized inside:

```text
src/lib/api.js
```

The application normalizes common failures including:

### Network Errors

```text
Could not reach the server.
```

Usually indicates:

* n8n is not running
* Incorrect webhook URL
* Vite proxy configuration issue
* Network connectivity issue

---

### Unexpected Server Response

```text
The server sent back an unexpected response.
```

Usually indicates that the backend returned HTML instead of JSON.

Common causes:

* HTTP 500 error
* Workflow execution failure
* Incorrect Respond to Webhook configuration
* Invalid webhook path

---

### Webhook Not Registered

```text
The requested webhook is not registered.
```

Usually indicates:

* Workflow is not published
* Incorrect webhook path
* Using a test webhook instead of production webhook
* n8n workflow is not active/published

---

# 🔧 Development Commands

Start development server:

```bash
npm run dev
```

Build production application:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 🎨 UI and UX

MindArena is designed as a modern competitive gaming and learning platform.

Key UI principles:

* Dark gaming-inspired interface
* Responsive layouts
* Mobile-friendly components
* Interactive quiz cards
* Clear contest status indicators
* Player lobby visualization
* Professional loading states
* Error feedback
* Consistent design system

---

# 🚀 Future Improvements

Potential future enhancements include:

* WebSocket-based real-time synchronization
* Live player presence indicators
* Contest chat
* Player avatars
* Public contest discovery
* Friend system
* Global leaderboard
* Achievement badges
* XP and leveling system
* Contest history
* Quiz categories
* Question difficulty analytics
* Admin dashboard
* Anti-cheating mechanisms
* Email notifications
* Push notifications
* Tournament brackets
* Team-based contests

---

# 🧩 Key Design Decisions

### Centralized API Layer

All backend communication is handled through:

```text
src/lib/api.js
```

This prevents duplicated fetch logic and makes backend changes easier to manage.

---

### Workflow-Based Backend

Instead of building a traditional backend server, MindArena uses n8n workflows for:

* Request routing
* Database operations
* Quiz generation
* AI operations
* Contest management

This allows rapid workflow development and visual backend debugging.

---

### Polling for Multiplayer Synchronization

The application currently uses polling for synchronization.

Advantages:

* Simple architecture
* No WebSocket infrastructure required
* Works across multiple browser sessions
* Easy integration with n8n

Future versions can migrate to Supabase Realtime or WebSockets for lower-latency synchronization.

---

# 📊 Typical Application Flow

```text
                 ┌───────────────┐
                 │     Login     │
                 └───────┬───────┘
                         │
                         ▼
                  ┌─────────────┐
                  │    Home     │
                  └──────┬──────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   ┌──────────────┐              ┌──────────────┐
   │ Practice Quiz│              │ Multiplayer  │
   └──────┬───────┘              └──────┬───────┘
          │                             │
          ▼                             ▼
   Generate Quiz                  Create / Join
          │                             │
          ▼                             ▼
      Take Quiz                       Lobby
          │                             │
          ▼                             ▼
       Results                     Live Contest
          │                             │
          ▼                             ▼
     AI Feedback                   Leaderboard
```

---

# 🤝 Contributing

Contributions, improvements, and feature suggestions are welcome.

Recommended workflow:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/feature-name
```

3. Make your changes
4. Test the application
5. Commit changes

```bash
git commit -m "Add feature"
```

6. Push the branch

```bash
git push origin feature/feature-name
```

7. Open a Pull Request

---

# 📄 License

This project is intended for educational and development purposes.

Add an appropriate open-source license before using the project for public distribution.

---

# 👨‍💻 Author

**MindArena Project**

An AI-powered quiz and multiplayer contest platform built with:

**React • Vite • Tailwind CSS • Supabase • n8n**

---

## ⭐ Project Vision

MindArena aims to make learning more engaging by combining:

> **Artificial Intelligence + Competitive Gaming + Collaborative Learning**

The goal is to transform traditional quizzes into interactive, competitive, and personalized learning experiences.

````

### Recommendation

Since your project is now working, I recommend keeping **three documentation files** in the repository:

```text
README.md
````

→ For GitHub visitors and installation instructions.

```text
ARCHITECTURE.md
```

→ Detailed frontend + n8n + Supabase architecture.

```text
API_CONTRACTS.md
```

→ Exact request/response formats for all n8n actions.

