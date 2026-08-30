import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swords, ArrowLeft, Sparkles, Sliders } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import ErrorBanner from '../../components/common/ErrorBanner'
import LoadingScreen from '../../components/common/LoadingScreen'

const TOPICS = ['Python', 'JavaScript', 'Java', 'SQL', 'General Knowledge', 'Custom']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const ROOM_CREATION_MESSAGES = [
  'Generating AI quiz questions...',
  'Creating battle room in Supabase...',
  'Registering host user profile...',
  'Generating unique 6-character room code...',
  'Preparing contest lobby...'
]

export default function CreateRoom() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [topic, setTopic] = useState('Python')
  const [customTopic, setCustomTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [numQuestions, setNumQuestions] = useState(5)
  const [maxPlayers, setMaxPlayers] = useState(6)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const resolvedTopic = topic === 'Custom' ? customTopic.trim() : topic

  async function handleSubmit(e) {
    e.preventDefault()
    if (!resolvedTopic) {
      setError('Please specify a topic for the contest.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await api.createRoom({
        topic: resolvedTopic,
        difficulty,
        number_of_questions: Number(numQuestions),
        max_players: Number(maxPlayers),
        host_id: user.id,
        player_name: user.full_name || 'Host'
      })

      const roomId = res?.room?.id || res?.room_id || res?.id

      if (!roomId) {
        throw new Error('Room created, but failed to retrieve room ID.')
      }

      toast.success('Room created! Share your code with players.')
      navigate(`/arena/lobby/${roomId}`)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not create room. Please verify n8n server connection.'
      setError(msg)
      toast.error('Room creation failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      {submitting && (
        <LoadingScreen
          messages={ROOM_CREATION_MESSAGES}
          subtext="Please wait a few seconds while n8n creates your quiz and room."
        />
      )}

      <main className="flex-1 max-w-lg w-full mx-auto px-5 py-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet/20 border border-violet/40">
            <Swords size={18} className="text-violet-soft" />
          </div>
          <span className="label-eyebrow">New Battle Arena</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Set Up Your Room</h1>
        <p className="text-muted text-sm mb-8">
          Configure topic, difficulty, and player limits for your live multiplayer contest.
        </p>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={handleSubmit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-6 shadow-2xl">
          {/* Topic Select */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quiz Topic</span>
              <Sparkles size={14} className="text-violet-soft" />
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input-field cursor-pointer"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {topic === 'Custom' && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Quantum Computing, World Cup History..."
                className="input-field mt-3"
                required
                autoFocus
              />
            )}
          </div>

          {/* Difficulty Select */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-xl py-3 text-sm font-semibold border transition-all ${
                    difficulty === d
                      ? 'bg-violet border-violet text-white shadow-lg shadow-violet/25'
                      : 'bg-raised border-border text-muted hover:border-violet-soft hover:text-ink'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Questions & Max Players */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
                Questions
              </label>
              <input
                type="number"
                min={3}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="input-field font-mono text-center text-lg font-bold"
              />
              <span className="text-[10px] text-muted mt-1 block text-center">3 to 20 questions</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
                Max Players
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                className="input-field font-mono text-center text-lg font-bold"
              />
              <span className="text-[10px] text-muted mt-1 block text-center">2 to 10 players</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-violet/25"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Quiz & Room…</span>
              </div>
            ) : (
              <>
                <Sliders size={18} />
                <span>Create Contest Room</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
