import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, ArrowLeft, Send } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'
import LoadingScreen from '../../components/common/LoadingScreen'
import ConfirmModal from '../../components/common/ConfirmModal'
import Timer from '../../components/arena/Timer'

const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d']

const SUBMIT_MESSAGES = [
  'Sending answers to n8n server...',
  'Evaluating choices against answer key...',
  'Computing percentage accuracy and completion time...',
  'Upserting contest results into database...',
  'Preparing leaderboard standings...'
]

export default function LiveContest() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [room, setRoom] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [startedAt, setStartedAt] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  useEffect(() => {
    loadContest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  useEffect(() => {
    if (!startedAt) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  async function loadContest() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getContest({ room_id: roomId, user_id: user.id })
      setRoom(res.room)
      setQuestions(res.questions || [])
      setStartedAt(Date.now())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the contest questions.')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  // Keyboard shortcut listener (Keys A, B, C, D)
  useEffect(() => {
    function handleKeyDown(e) {
      const q = questions[current]
      if (!q) return
      const key = e.key.toLowerCase()

      if (['a', 'b', 'c', 'd'].includes(key)) {
        const optionIdx = key.charCodeAt(0) - 97
        const optKey = OPTION_KEYS[optionIdx]
        const val = q[optKey]
        if (val) selectAnswer(q.id, val)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, questions, selectAnswer])

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)

    const payloadAnswers = questions.map((q) => ({
      question_id: q.id,
      selected_answer: answers[q.id] || ''
    }))

    try {
      const res = await api.submitResult({
        room_id: roomId,
        user_id: user.id,
        player_name: user.full_name || 'Player',
        completion_time_seconds: elapsed,
        answers: payloadAnswers
      })

      toast.success('Answers submitted successfully!')
      navigate(`/arena/results/${roomId}`, {
        state: { result: res.result, review: res.review }
      })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not submit your answers.'
      setError(msg)
      toast.error('Submission failed. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Fetching contest questions…" />
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <main className="max-w-md mx-auto px-5 py-12 flex-1 flex flex-col justify-center">
          <ErrorBanner message={error} onRetry={loadContest} />
        </main>
      </div>
    )
  }

  const question = questions[current] || {}
  const isLast = current === questions.length - 1
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      {submitting && (
        <LoadingScreen
          messages={SUBMIT_MESSAGES}
          subtext="Please wait a few seconds while n8n scores your answers and updates the leaderboard."
        />
      )}

      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-8 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowExitModal(true)}
              className="flex items-center gap-1 text-muted hover:text-ink text-xs transition-colors"
            >
              <ArrowLeft size={14} />
              Leave Contest
            </button>
            <span className="label-eyebrow font-mono text-xs">
              Question {current + 1} of {questions.length}
            </span>
            <Timer seconds={elapsed} />
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-raised rounded-full mb-8 overflow-hidden border border-border/40">
            <div
              className="h-full bg-gradient-to-r from-violet to-amber transition-all duration-300"
              style={{ width: `${((current + 1) / (questions.length || 1)) * 100}%` }}
            />
          </div>

          {error && (
            <div className="mb-6">
              <ErrorBanner message={error} onRetry={handleSubmit} />
            </div>
          )}

          {/* Question Card */}
          {question && (
            <div className="card p-6 mb-8 border-border/80 shadow-2xl bg-surface/90">
              <h2 className="font-display text-lg sm:text-xl font-semibold mb-6 text-ink leading-relaxed">
                {question.question}
              </h2>

              <div className="space-y-3">
                {OPTION_KEYS.map((key, optionIdx) => {
                  const value = question[key]
                  if (!value) return null
                  const selected = answers[question.id] === value

                  return (
                    <button
                      key={key}
                      onClick={() => selectAnswer(question.id, value)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                        selected
                          ? 'bg-violet/20 border-violet text-ink shadow-md shadow-violet/10 font-medium'
                          : 'bg-raised/70 border-border text-muted hover:border-violet-soft hover:text-ink'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          selected
                            ? 'bg-violet text-white'
                            : 'bg-void border border-border text-muted'
                        }`}
                      >
                        {String.fromCharCode(65 + optionIdx)}
                      </span>
                      <span className="flex-1 text-sm sm:text-base leading-snug">{value}</span>
                      {selected && <CheckCircle size={18} className="text-violet-soft shrink-0 mt-0.5" />}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted text-right font-mono">
                Keyboard: <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">A</kbd>, <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">B</kbd>, <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">C</kbd>, <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">D</kbd>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/60">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0 || submitting}
            className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-amber flex-1 py-3 flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber/20"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                  <span>Submitting…</span>
                </div>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit ({answeredCount}/{questions.length})</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              disabled={submitting}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              <span>Next Question</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={showExitModal}
        title="Leave Active Contest?"
        message="Are you sure you want to exit? Your current contest answers will be lost."
        confirmLabel="Leave Contest"
        onConfirm={() => navigate('/')}
        onCancel={() => setShowExitModal(false)}
        isDangerous
      />
    </div>
  )
}
