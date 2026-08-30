import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from 'lucide-react'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'
import ConfirmModal from '../../components/common/ConfirmModal'

const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d']

export default function PracticeQuiz() {
  const { quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [startedAt] = useState(Date.now())
  const [showExitModal, setShowExitModal] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getQuiz(quizId)
      setQuiz(res.quiz)
      setQuestions(res.questions || [])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the practice quiz.')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = useCallback((index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }))
  }, [])

  // Keyboard shortcut listener (Keys A, B, C, D)
  useEffect(() => {
    function handleKeyDown(e) {
      if (!questions[current]) return
      const key = e.key.toLowerCase()

      if (['a', 'b', 'c', 'd'].includes(key)) {
        const optionIdx = key.charCodeAt(0) - 97
        const optKey = OPTION_KEYS[optionIdx]
        const val = questions[current][optKey]
        if (val) selectAnswer(current, val)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, questions, selectAnswer])

  function checkIsCorrect(yourAnswer, q) {
    if (!yourAnswer || !q) return false
    const normYour = yourAnswer.trim().toLowerCase()
    const normCorrect = (q.correct_answer || '').trim().toLowerCase()

    if (normYour === normCorrect) return true

    if (['option_a', 'a', 'option a'].includes(normCorrect)) {
      return normYour === (q.option_a || '').trim().toLowerCase()
    }
    if (['option_b', 'b', 'option b'].includes(normCorrect)) {
      return normYour === (q.option_b || '').trim().toLowerCase()
    }
    if (['option_c', 'c', 'option c'].includes(normCorrect)) {
      return normYour === (q.option_c || '').trim().toLowerCase()
    }
    if (['option_d', 'd', 'option d'].includes(normCorrect)) {
      return normYour === (q.option_d || '').trim().toLowerCase()
    }
    return false
  }

  function handleSubmit() {
    let score = 0
    const review = questions.map((q, idx) => {
      const yourAnswer = answers[idx] || ''
      const isCorrect = checkIsCorrect(yourAnswer, q)
      if (isCorrect) score += 1
      return {
        question: q.question,
        your_answer: yourAnswer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: q.explanation
      }
    })

    const totalQuestions = questions.length
    const percentage = totalQuestions ? Number(((score / totalQuestions) * 100).toFixed(2)) : 0
    const completionTimeSeconds = Math.floor((Date.now() - startedAt) / 1000)

    navigate('/practice/results', {
      state: {
        result: { score, total_questions: totalQuestions, percentage, completion_time_seconds: completionTimeSeconds },
        review,
        topic: quiz?.topic || location.state?.topic,
        difficulty: quiz?.difficulty || location.state?.difficulty
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Fetching practice quiz..." />
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <main className="max-w-md mx-auto px-5 py-12 flex-1 flex flex-col justify-center">
          <ErrorBanner message={error} onRetry={load} />
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

      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-8 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowExitModal(true)}
              className="flex items-center gap-1 text-muted hover:text-ink text-xs transition-colors"
            >
              <ArrowLeft size={14} />
              Exit Quiz
            </button>
            <span className="label-eyebrow font-mono text-xs">
              Question {current + 1} of {questions.length}
            </span>
            <span className="text-xs font-semibold text-amber bg-raised px-2.5 py-1 rounded-lg border border-border">
              {quiz?.topic || location.state?.topic} · {quiz?.difficulty || location.state?.difficulty}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-raised rounded-full mb-8 overflow-hidden border border-border/40">
            <div
              className="h-full bg-gradient-to-r from-violet to-amber transition-all duration-300"
              style={{ width: `${((current + 1) / (questions.length || 1)) * 100}%` }}
            />
          </div>

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
                  const selected = answers[current] === value

                  return (
                    <button
                      key={key}
                      onClick={() => selectAnswer(current, value)}
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
                      {selected && <CheckCircle2 size={18} className="text-violet-soft shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted text-right font-mono">
                Tip: Press <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">A</kbd>, <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">B</kbd>, <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">C</kbd>, or <kbd className="px-1.5 py-0.5 bg-void border border-border rounded text-ink">D</kbd> on keyboard
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/60">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              className="btn-amber flex-1 py-3 flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber/20"
            >
              <Send size={16} />
              <span>Submit ({answeredCount}/{questions.length})</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={showExitModal}
        title="Exit Practice Quiz?"
        message="Your current practice progress will not be saved."
        confirmLabel="Exit Quiz"
        onConfirm={() => navigate('/practice')}
        onCancel={() => setShowExitModal(false)}
        isDangerous
      />
    </div>
  )
}
