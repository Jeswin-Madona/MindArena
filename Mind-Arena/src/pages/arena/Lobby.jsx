import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Play, Hourglass, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'
import LoadingScreen from '../../components/common/LoadingScreen'
import ConfirmModal from '../../components/common/ConfirmModal'
import RoomCodeBadge from '../../components/arena/RoomCodeBadge'
import PlayerList from '../../components/arena/PlayerList'

const POLL_MS = 2000

const START_CONTEST_MESSAGES = [
  'Updating room status to started...',
  'Fetching contest questions...',
  'Syncing participants...',
  'Entering battle arena...'
]

export default function Lobby() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [starting, setStarting] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const prevCountRef = useRef(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchRoom(true)
    intervalRef.current = setInterval(() => fetchRoom(false), POLL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  async function fetchRoom(isInitial) {
    try {
      const res = await api.getRoom({ room_id: roomId })

      if (!res?.room) {
        throw new Error('Room details could not be found.')
      }

      setRoom(res.room)
      const currentPlayers = res.players || []

      // Toast alert when a new player joins
      if (!isInitial && currentPlayers.length > prevCountRef.current && prevCountRef.current > 0) {
        const newest = currentPlayers[currentPlayers.length - 1]
        if (newest && newest.user_id !== user.id) {
          toast.info(`${newest.player_name} joined the lobby!`)
        }
      }
      prevCountRef.current = currentPlayers.length

      setPlayers(currentPlayers)
      setError(null)

      if (res.room.status === 'started') {
        if (intervalRef.current) clearInterval(intervalRef.current)
        toast.success('Contest started! Get ready!')
        navigate(`/arena/contest/${roomId}`)
      }
    } catch (err) {
      if (isInitial) {
        setError(err instanceof ApiError ? err.message : 'Could not load the room details.')
      }
    } finally {
      if (isInitial) setLoading(false)
    }
  }

  async function handleStart() {
    setStarting(true)
    setError(null)

    try {
      await api.startContest({
        room_id: roomId,
        host_id: user.id,
        quiz_id: room.quiz_id
      })
      if (intervalRef.current) clearInterval(intervalRef.current)
      toast.success('Contest launched!')
      navigate(`/arena/contest/${roomId}`)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not start the contest.'
      setError(msg)
      toast.error('Failed to start contest.')
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Connecting to lobby..." />
        </div>
      </div>
    )
  }

  if (error && !room) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <main className="max-w-md mx-auto px-5 py-12 flex-1 flex flex-col justify-center">
          <ErrorBanner message={error} onRetry={() => fetchRoom(true)} />
          <button
            onClick={() => navigate('/')}
            className="btn-secondary w-full mt-4 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </main>
      </div>
    )
  }

  const isHost = room?.host_id === user.id
  const totalQuestions = room?.number_of_questions || room?.num_questions || 5

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      {starting && (
        <LoadingScreen
          messages={START_CONTEST_MESSAGES}
          subtext="Preparing quiz questions for all participants..."
        />
      )}

      <main className="flex-1 max-w-lg w-full mx-auto px-5 py-10">
        <button
          onClick={() => setShowExitModal(true)}
          className="flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Leave Lobby
        </button>

        {/* Room Code Header */}
        <div className="flex flex-col items-center mb-8">
          <RoomCodeBadge code={room.room_code} />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={() => fetchRoom(false)} />
          </div>
        )}

        {/* Room Overview Card */}
        <div className="card p-5 mb-6 grid grid-cols-3 gap-3 text-center bg-surface/90 border-border/80 shadow-lg">
          <div>
            <span className="text-[11px] font-mono uppercase text-muted block mb-1">Topic</span>
            <p className="font-semibold text-ink text-sm truncate">{room.topic}</p>
          </div>
          <div className="border-x border-border/60">
            <span className="text-[11px] font-mono uppercase text-muted block mb-1">Difficulty</span>
            <span className="font-semibold text-amber text-sm">{room.difficulty}</span>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-muted block mb-1">Questions</span>
            <p className="font-semibold text-ink text-sm">{totalQuestions} Qs</p>
          </div>
        </div>

        {/* Player Roster */}
        <div className="mb-8">
          <PlayerList players={players} maxPlayers={room.max_players} />
        </div>

        {/* Control Button / Waiting Message */}
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={starting || players.length < 1}
            className="btn-amber w-full py-4 text-lg font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-amber/20"
          >
            {starting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                <span>Launching Contest…</span>
              </div>
            ) : (
              <>
                <Play size={20} className="fill-current" />
                <span>Start Contest Now ({players.length} Ready)</span>
              </>
            )}
          </button>
        ) : (
          <div className="card p-5 border-amber/30 bg-amber/5 flex items-center justify-center gap-3 text-amber shadow-lg">
            <Hourglass size={20} className="animate-spin text-amber" />
            <span className="font-medium text-sm">
              Waiting for host to start the battle…
            </span>
          </div>
        )}
      </main>

      {/* Leave Lobby Confirmation Modal */}
      <ConfirmModal
        isOpen={showExitModal}
        title="Leave Contest Lobby?"
        message="You will disconnect from this room session."
        confirmLabel="Leave Lobby"
        onConfirm={() => navigate('/')}
        onCancel={() => setShowExitModal(false)}
        isDangerous
      />
    </div>
  )
}
