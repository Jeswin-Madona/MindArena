import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Crown, Medal, ArrowLeft, RefreshCw, Trophy } from 'lucide-react'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

const RANK_BADGES = [
  { color: 'text-amber fill-amber/20', bg: 'bg-amber/10 border-amber/30' },
  { color: 'text-slate-300 fill-slate-300/20', bg: 'bg-slate-300/10 border-slate-300/30' },
  { color: 'text-amber-700 fill-amber-700/20', bg: 'bg-amber-700/10 border-amber-700/30' },
]

export default function Leaderboard() {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  async function load() {
    try {
      const res = await api.getLeaderboard({ room_id: roomId })
      setRoom(res.room)
      setRows(res.leaderboard || [])
      setError(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the leaderboard.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Fetching leaderboard standings…" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber/20 border border-amber/40">
              <Trophy size={18} className="text-amber" />
            </div>
            <span className="label-eyebrow">Official Standings</span>
          </div>

          <button
            onClick={load}
            className="text-muted hover:text-ink transition-colors p-2 rounded-lg hover:bg-raised"
            title="Refresh Leaderboard"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold mb-1 text-ink">
          {room?.topic || 'Contest'} Leaderboard
        </h1>
        <p className="text-muted text-xs font-mono mb-8">
          Difficulty: {room?.difficulty || 'N/A'} · Ranked by Percentage & Time
        </p>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={load} />
          </div>
        )}

        {/* Leaderboard Roster */}
        <div className="card divide-y divide-border/60 border-border/80 shadow-2xl bg-surface/90 overflow-hidden">
          {rows.map((r, idx) => {
            const rank = r.rank ?? idx + 1
            const badge = RANK_BADGES[idx]

            return (
              <div
                key={`${r.player_name}-${idx}`}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                  idx === 0 ? 'bg-amber/5' : ''
                }`}
              >
                {/* Rank Badge */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-sm">
                  {idx < 3 ? (
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${badge.bg}`}>
                      {idx === 0 ? (
                        <Crown size={20} className={badge.color} />
                      ) : (
                        <Medal size={20} className={badge.color} />
                      )}
                    </div>
                  ) : (
                    <span className="text-muted bg-raised w-8 h-8 rounded-lg flex items-center justify-center border border-border">
                      #{rank}
                    </span>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{r.player_name}</p>
                  <p className="text-xs text-muted font-mono">
                    {r.score ?? '—'}/{r.total_questions ?? '—'} Correct
                  </p>
                </div>

                {/* Score Metrics */}
                <div className="text-right">
                  <p className="font-mono font-bold text-amber text-base">
                    {r.percentage}%
                  </p>
                  <p className="text-xs text-muted font-mono">{r.completion_time_seconds}s</p>
                </div>
              </div>
            )
          })}

          {rows.length === 0 && (
            <div className="text-center py-10 px-5">
              <p className="text-muted text-sm">No submissions recorded yet for this contest.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
