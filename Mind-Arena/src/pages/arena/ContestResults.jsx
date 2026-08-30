import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Trophy, ArrowRight, Clock, Award } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'

export default function ContestResults() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const location = useLocation()

  const [result, setResult] = useState(location.state?.result || null)
  const [review, setReview] = useState(location.state?.review || null)
  const [loading, setLoading] = useState(!location.state?.result)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!result && roomId) {
      fetchResultFromLeaderboard()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  async function fetchResultFromLeaderboard() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getLeaderboard({ room_id: roomId })
      const rows = res.leaderboard || []
      const userResult = rows.find((r) => r.user_id === user?.id || r.player_name === user?.full_name) || rows[0]

      if (userResult) {
        setResult({
          score: userResult.score,
          total_questions: userResult.total_questions,
          percentage: userResult.percentage,
          completion_time_seconds: userResult.completion_time_seconds
        })
      } else {
        setError('No result found for this contest.')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load contest result.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Loading contest results…" />
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <main className="max-w-md mx-auto px-5 py-12 flex-1 flex flex-col items-center justify-center text-center">
          {error && <ErrorBanner message={error} className="mb-4 w-full" />}
          <p className="text-muted mb-6">No active contest results found for this session.</p>
          <Link to={`/arena/leaderboard/${roomId}`} className="btn-primary inline-flex items-center gap-2">
            <Trophy size={18} />
            <span>View Contest Leaderboard</span>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-10">
        {/* Results Banner Card */}
        <div className="card p-8 text-center mb-8 bg-arena-glow border-violet-soft/30 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/20 border border-violet/40 text-violet-soft text-xs font-mono mb-4">
            <Award size={14} />
            <span>Contest Complete</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink mb-6">Battle Finished!</h1>

          <div className="font-mono text-5xl font-extrabold text-amber mb-2 tracking-tight">
            {result.score} / {result.total_questions}
          </div>

          <p className="text-xl font-semibold text-ink mb-6">
            {result.percentage}% Correct
          </p>

          <div className="inline-flex items-center gap-6 px-6 py-2.5 rounded-xl bg-raised border border-border/80 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted" />
              <span className="text-muted">Completion Time:</span>
              <span className="font-mono font-semibold text-amber">{result.completion_time_seconds}s</span>
            </div>
          </div>
        </div>

        {/* View Leaderboard Button */}
        <Link
          to={`/arena/leaderboard/${roomId}`}
          className="btn-amber w-full py-4 text-base font-bold flex items-center justify-center gap-2.5 mb-10 shadow-xl shadow-amber/20"
        >
          <Trophy size={20} />
          <span>View Live Leaderboard</span>
          <ArrowRight size={18} />
        </Link>

        {/* Answer Breakdown */}
        {review && review.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="label-eyebrow">Question Review</span>
              <span className="text-xs text-muted font-mono">{review.length} Questions</span>
            </div>

            <div className="space-y-4">
              {review.map((r, idx) => (
                <div key={r.question_id || idx} className="card p-5 border-border/80 shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    {r.is_correct ? (
                      <CheckCircle2 size={20} className="text-emerald shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={20} className="text-rose shrink-0 mt-0.5" />
                    )}
                    <p className="font-medium text-ink text-sm leading-relaxed">
                      <span className="font-mono font-bold text-muted mr-1.5">{idx + 1}.</span>
                      {r.question}
                    </p>
                  </div>

                  <div className="pl-8 space-y-1.5 text-xs">
                    <p className="text-muted">
                      Your answer:{' '}
                      <span className={`font-semibold ${r.is_correct ? 'text-emerald' : 'text-rose'}`}>
                        {r.your_answer || 'No answer selected'}
                      </span>
                    </p>

                    {!r.is_correct && (
                      <p className="text-emerald">
                        Correct answer: <span className="font-semibold">{r.correct_answer}</span>
                      </p>
                    )}

                    {r.explanation && (
                      <p className="text-muted/90 italic pt-1.5 border-t border-border/50">
                        💡 {r.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
