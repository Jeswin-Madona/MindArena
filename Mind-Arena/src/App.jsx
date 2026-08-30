import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import CreateRoom from './pages/arena/CreateRoom'
import JoinRoom from './pages/arena/JoinRoom'
import Lobby from './pages/arena/Lobby'
import LiveContest from './pages/arena/LiveContest'
import ContestResults from './pages/arena/ContestResults'
import Leaderboard from './pages/arena/Leaderboard'
import PracticeGenerate from './pages/practice/PracticeGenerate'
import PracticeQuiz from './pages/practice/PracticeQuiz'
import PracticeResults from './pages/practice/PracticeResults'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

      <Route path="/arena/create" element={<ProtectedRoute><CreateRoom /></ProtectedRoute>} />
      <Route path="/arena/join" element={<ProtectedRoute><JoinRoom /></ProtectedRoute>} />
      <Route path="/arena/lobby/:roomId" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
      <Route path="/arena/contest/:roomId" element={<ProtectedRoute><LiveContest /></ProtectedRoute>} />
      <Route path="/arena/results/:roomId" element={<ProtectedRoute><ContestResults /></ProtectedRoute>} />
      <Route path="/arena/leaderboard/:roomId" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

      <Route path="/practice" element={<ProtectedRoute><PracticeGenerate /></ProtectedRoute>} />
      <Route path="/practice/quiz/:quizId" element={<ProtectedRoute><PracticeQuiz /></ProtectedRoute>} />
      <Route path="/practice/results" element={<ProtectedRoute><PracticeResults /></ProtectedRoute>} />
    </Routes>
  )
}
