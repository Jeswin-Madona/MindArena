import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import ErrorBanner from '../../components/common/ErrorBanner'
import LoadingScreen from '../../components/common/LoadingScreen'

const JOIN_LOADING_MESSAGES = [
  'Validating room code...',
  'Checking player capacity...',
  'Registering player in room_players...',
  'Connecting to contest lobby...'
]

export default function JoinRoom() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [roomCode, setRoomCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const cleanCode = roomCode.trim().toUpperCase()
    if (!cleanCode) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await api.joinRoom({
        room_code: cleanCode,
        user_id: user.id,
        player_name: user.full_name || 'Player'
      })

      const targetRoomId = res?.room?.id || res?.room_id || res?.id

      if (!targetRoomId) {
        throw new Error('Room details missing from server response.')
      }

      toast.success('Joined room successfully!')
      navigate(`/arena/lobby/${targetRoomId}`)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not join the room. Check the code and try again.'
      setError(msg)
      toast.error('Could not join room.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      {submitting && (
        <LoadingScreen
          messages={JOIN_LOADING_MESSAGES}
          subtext="Joining room and validating credentials with n8n..."
        />
      )}

      <main className="flex-1 max-w-md w-full mx-auto px-5 py-12 flex flex-col justify-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 w-fit transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-amber/20 border border-amber/40">
            <LogIn size={18} className="text-amber" />
          </div>
          <span className="label-eyebrow">Join Contest</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Enter Room Code</h1>
        <p className="text-muted text-sm mb-8">
          Got a 6-character room code from your contest host? Type it below to join the lobby.
        </p>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={handleSubmit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-6 shadow-2xl">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. 7F3K2Q"
              maxLength={8}
              autoFocus
              className="input-field font-mono text-3xl tracking-[0.3em] text-center uppercase font-bold py-4 text-amber border-amber/30 focus:border-amber"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !roomCode.trim()}
            className="btn-amber w-full py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-amber/20"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                <span>Joining Room…</span>
              </div>
            ) : (
              'Join Room'
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
