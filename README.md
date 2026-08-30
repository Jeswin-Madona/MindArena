# 🧠 MindArena - AI-Powered Quiz & Multiplayer Contest Platform

> **Learn. Compete. Improve.**

MindArena is a modern AI-powered quiz platform that combines **individual practice** with **real-time multiplayer quiz contests**.

Users can generate quizzes on custom topics, practice independently, receive AI-generated performance feedback, create multiplayer contest rooms, invite players using room codes, compete in synchronized quiz sessions, and view results on a leaderboard.

The platform combines a modern React frontend with **Supabase** for authentication and data persistence, and **n8n workflows** for backend automation and AI-powered operations.

---

## ✨ Features

### 🎯 AI-Powered Practice Mode

* Generate quizzes on custom topics
* Select difficulty levels
* Configure the number of questions
* Interactive question-by-question quiz experience
* Instant score calculation
* AI-generated performance feedback
* Responsive practice interface

### ⚔️ Multiplayer Contest Arena

* Create multiplayer quiz rooms
* Generate unique room codes
* Join contests using room codes
* Support multiple players
* Live lobby player updates
* Host-controlled contest start
* Synchronized multiplayer experience
* Question timer
* Server-side result submission
* Contest results page
* Ranked leaderboard

### 🔐 Authentication

* Supabase authentication
* Username and password login
* Session persistence
* Protected routes
* User profile integration
* Logout functionality
* Password recovery support

### ⏳ Professional Loading Experience

MindArena includes loading states for operations that depend on backend workflows.

Users receive visual feedback while waiting for:

* Quiz generation
* Contest creation
* Room joining
* Contest loading
* AI feedback generation
* Result processing

This improves the user experience when n8n workflows require additional processing time.

---

# 🏗️ Technology Stack

## Frontend

* React 18
* Vite
* React Router DOM
* Tailwind CSS
* Lucide React

## Backend Automation

* n8n
* Webhooks
* Workflow automation
* AI-powered quiz processing

## Database & Authentication

* Supabase
* PostgreSQL
* Supabase Authentication

## Development Tools

* JavaScript
* REST APIs
* Vite Development Proxy
* Git & GitHub

---

# 🏛️ System Architecture

```text
                           ┌──────────────┐
                           │     User     │
                           └──────┬───────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │    React + Vite App     │
                    │                         │
                    │  Practice │ Multiplayer │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Central API Layer   │
                    │       src/lib/api.js    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       Vite Proxy        │
                    │         /n8n/*          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │          n8n            │
                    │    Workflow Engine      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │ AI / Quiz Logic │       │    Supabase     │
          │                 │       │ Database + Auth │
          └─────────────────┘       └─────────────────┘
```

For detailed architecture documentation, see:

📄 [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md)

---

# 📂 Project Structure

```text
mindarena/
│
├── docs/
│   ├── API_CONTRACTS.md
│   ├── PROJECT_DOCUMENTATION.md
│   └── README.md
│
├── schemas/
│   └── database_schema.sql
│
├── screenshots/
│   └── application screenshots
│
├── workflows/
│   ├── Generate Quiz Workflow.json
│   ├── Get Quiz Workflow.json
│   ├── AI Feedback Workflow.json
│   └── MindArena Management.json
│
├── src/
│   │
│   ├── components/
│   │   ├── arena/
│   │   ├── common/
│   │   └── layout/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── supabaseClient.js
│   │
│   ├── pages/
│   │   ├── arena/
│   │   ├── practice/
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── README.md
```

---

# 🔄 Application Flow

```text
                         ┌──────────────┐
                         │    Login     │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │     Home     │
                         └──────┬───────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
      ┌───────────────┐                   ┌────────────────┐
      │ Practice Mode │                   │ Contest Arena  │
      └───────┬───────┘                   └───────┬────────┘
              │                                   │
              ▼                                   ▼
      Generate AI Quiz                   Create / Join Room
              │                                   │
              ▼                                   ▼
         Take Quiz                              Lobby
              │                                   │
              ▼                                   ▼
        View Results                         Start Contest
              │                                   │
              ▼                                   ▼
       AI Feedback                        Live Multiplayer Quiz
                                                  │
                                                  ▼
                                            Submit Results
                                                  │
                                                  ▼
                                             Leaderboard
```

---

# ⚔️ Multiplayer Contest Workflow

The multiplayer system is managed through a centralized n8n workflow.

## Supported Operations

| Action           | Description                       |
| ---------------- | --------------------------------- |
| `createRoom`     | Creates a new contest room        |
| `joinRoom`       | Adds a player to an existing room |
| `getRoom`        | Retrieves room and player details |
| `startContest`   | Starts the contest                |
| `getContest`     | Retrieves contest questions       |
| `submitResult`   | Submits a player's result         |
| `getLeaderboard` | Returns ranked contest results    |

---

## Create Contest

The host creates a room by providing:

* Topic
* Difficulty
* Number of questions
* Maximum players

Example request:

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

The workflow:

1. Generates or retrieves the quiz
2. Creates a contest room
3. Generates a unique room code
4. Adds the host as the first player
5. Returns room information

---

## Join Contest

Players join using a room code.

```json
{
  "action": "joinRoom",
  "room_code": "ABC12345",
  "user_id": "player-id",
  "player_name": "Player Name"
}
```

The workflow validates:

* Room existence
* Contest status
* Maximum player limit
* Duplicate players

After validation, the player is added to the room.

---

## Lobby Synchronization

MindArena currently uses polling for multiplayer synchronization.

```text
Player joins room
       │
       ▼
Supabase database updated
       │
       ▼
Lobby polls room status
       │
       ▼
Player list refreshes
       │
       ▼
All users see updated lobby
```

When the host starts the contest, connected players detect the room status change during polling and automatically transition into the contest.

---

# 🗄️ Database

MindArena uses Supabase PostgreSQL.

The database schema is available here:

📄 [`schemas/database_schema.sql`](schemas/database_schema.sql)

Core tables include:

### `profiles`

Stores user profile information.

### `rooms`

Stores multiplayer contest room information.

### `room_players`

Stores players participating in each room.

### `contest_results`

Stores submitted contest results and scores.

---

# 🔐 Authentication

Authentication is powered by Supabase.

The application supports:

* User login
* Session persistence
* Protected routes
* User profile management
* Logout
* Password recovery

Unauthenticated users are redirected to the login page when attempting to access protected application areas.

---

# 🔌 API Architecture

All frontend API communication is centralized in:

```text
src/lib/api.js
```

This provides a single communication layer between the React frontend and n8n workflows.

```text
React Component
       │
       ▼
src/lib/api.js
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
       ├── Quiz Generation
       ├── Quiz Retrieval
       ├── AI Feedback
       └── Arena Management
```

Detailed API request and response formats are available in:

📄 [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md)

---

# 🌐 Development Proxy

During development, requests are routed through the Vite proxy.

This prevents browser CORS issues when communicating with a locally running n8n instance.

Example flow:

```text
Frontend Request

http://localhost:5173/n8n/...

        │
        ▼

Vite Development Proxy

        │
        ▼

http://localhost:5678/webhook/...
```

The exact configuration can be found in:

```text
vite.config.js
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
cd mindarena
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_N8N_BASE_URL=your_n8n_base_url
```

> ⚠️ Never commit your actual `.env` file to GitHub.

---

## 4. Configure Supabase

1. Create a Supabase project.
2. Open the SQL Editor.
3. Run the provided database schema:

```text
schemas/database_schema.sql
```

4. Configure authentication.
5. Configure Row Level Security policies as required.

---

## 5. Configure n8n

Import the workflow files from:

```text
workflows/
```

The workflows include:

* Quiz generation
* Quiz retrieval
* AI feedback
* Multiplayer arena management

Ensure:

* Webhook paths match the frontend configuration
* Required credentials are configured
* Supabase credentials are connected
* AI provider credentials are configured
* Workflows are published/available

---

## 6. Start n8n

For local development:

```bash
n8n start
```

Default URL:

```text
http://localhost:5678
```

---

## 7. Start the Frontend

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 🛠 Development Commands

### Start Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

# 🚨 Error Handling

MindArena centralizes API error handling through:

```text
src/lib/api.js
```

Common errors include:

### Network Error

```text
Could not reach the server.
```

Possible causes:

* n8n is not running
* Incorrect webhook URL
* Vite proxy issue
* Network interruption

---

### Unexpected Server Response

```text
The server sent back an unexpected response.
```

Usually means the frontend expected JSON but received another response format.

Possible causes:

* n8n workflow returned HTTP 500
* Workflow execution failed
* Respond to Webhook node is misconfigured
* Invalid webhook endpoint

---

### Webhook Not Registered

```text
The requested webhook is not registered.
```

Possible causes:

* Incorrect webhook path
* Workflow is not published
* Workflow is inactive
* Test and production webhook URLs are mixed

---

# 🎨 UI & UX

MindArena follows a modern competitive learning and gaming-inspired design.

Key design principles include:

* Dark modern interface
* Responsive layouts
* Mobile-friendly design
* Clear visual hierarchy
* Interactive quiz components
* Professional loading states
* User-friendly error messages
* Contest-focused experience
* Consistent design system

---

# 📸 Screenshots

Application screenshots can be found in:

```text
screenshots/
```

You can add preview images to this README later using:

```markdown
![MindArena Home](screenshots/home.png)
```

```markdown
![Contest Lobby](screenshots/lobby.png)
```

```markdown
![Live Contest](screenshots/contest.png)
```

---

# 📚 Documentation

Additional project documentation is available in the `docs/` directory.

| Document                                                    | Description                                 |
| ----------------------------------------------------------- | ------------------------------------------- |
| [`API_CONTRACTS.md`](docs/API_CONTRACTS.md)                 | API request and response contracts          |
| [`PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md) | Complete technical project documentation    |
| [`docs/README.md`](docs/README.md)                          | Extended project overview and documentation |

Database resources:

| Resource                                             | Description              |
| ---------------------------------------------------- | ------------------------ |
| [`database_schema.sql`](schemas/database_schema.sql) | Supabase database schema |

---

# 🚀 Future Improvements

Potential future enhancements include:

* WebSocket or Supabase Realtime synchronization
* Live player presence
* Public contest discovery
* Global leaderboard
* Player profiles and avatars
* Friend system
* XP and leveling
* Achievement badges
* Contest history
* Quiz analytics
* Question difficulty analysis
* Contest chat
* Team-based contests
* Tournament brackets
* Anti-cheating mechanisms
* Admin dashboard
* Email notifications
* Push notifications

---

# 🧩 Key Design Decisions

## Centralized API Layer

All frontend-to-backend communication is handled through:

```text
src/lib/api.js
```

This prevents duplicated request logic and simplifies backend maintenance.

---

## Workflow-Based Backend

Instead of a traditional backend server, MindArena uses n8n workflows for:

* Request handling
* Database operations
* Quiz generation
* AI integration
* Contest room management
* Result processing
* Leaderboard generation

This approach enables visual workflow management and rapid backend iteration.

---

## Polling-Based Multiplayer Synchronization

The current implementation uses polling.

Advantages include:

* Simple architecture
* No dedicated WebSocket server
* Works across multiple browser sessions
* Easy integration with n8n workflows

A future version could migrate to:

* Supabase Realtime
* WebSockets
* Server-Sent Events

for lower-latency synchronization.

---

# 🤝 Contributing

Contributions and improvements are welcome.

Recommended workflow:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/feature-name
```

3. Make changes
4. Test the application
5. Commit changes

```bash
git commit -m "Add feature"
```

6. Push your branch

```bash
git push origin feature/feature-name
```

7. Open a Pull Request

---

# 📄 License

This project is currently intended for educational and development purposes.

Add an appropriate open-source license before using the project for public distribution.

---

# 👨‍💻 Author

**MindArena Project**

Built using:

**React • Vite • Tailwind CSS • Supabase • PostgreSQL • n8n**

---

# 🌟 Project Vision

MindArena aims to make learning more engaging by combining:

> **Artificial Intelligence + Competitive Gaming + Collaborative Learning**

The goal is to transform traditional quizzes into an interactive and competitive learning experience where users can **learn individually, compete together, and continuously improve**.

---

## ⭐ If you like this project

Consider giving the repository a **star ⭐** and sharing your feedback!
