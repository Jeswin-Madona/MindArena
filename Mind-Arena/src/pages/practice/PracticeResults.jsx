import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Sparkles, Award, RefreshCw, ArrowRight } from 'lucide-react'
import { api, ApiError } from '../../lib/api'
import Navbar from '../../components/layout/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorBanner from '../../components/common/ErrorBanner'
import Skeleton from '../../components/common/Skeleton'

export default function PracticeResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, review, topic, difficulty } = location.state || {}

  const [feedback, setFeedback] = useState(null)
  const [loadingFeedback, setLoadingFeedback] = useState(true)
  const [feedbackError, setFeedbackError] = useState(null)

  useEffect(() => {
    if (!result) return
    loadFeedback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadFeedback() {
    setLoadingFeedback(true)
    setFeedbackError(null)
    try {
      const res = await api.getAiFeedback({
        topic: topic || 'General Knowledge',
        difficulty: difficulty || 'Medium',
        score: result.score,
        total_questions: result.total_questions,
        percentage: result.percentage
      })
      setFeedback(res)
    } catch (err) {
      setFeedbackError(err instanceof ApiError ? err.message : 'Could not generate AI feedback.')
    } finally {
      setLoadingFeedback(false)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <main className="max-w-md mx-auto px-5 py-12 flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-muted mb-6">No solo practice result found for this session.</p>
          <button onClick={() => navigate('/practice')} className="btn-primary">
            Start a Practice Quiz
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-10">
        {/* Banner Card */}
        <div className="card p-8 text-center mb-8 bg-arena-glow border-violet-soft/30 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/20 border border-violet/40 text-violet-soft text-xs font-mono mb-4">
            <Award size={14} />
            <span>Practice Completed</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink mb-6">Great Effort!</h1>

          <div className="font-mono text-5xl font-extrabold text-amber mb-2 tracking-tight">
            {result.score} / {result.total_questions}
          </div>

          <p className="text-xl font-semibold text-ink">
            {result.percentage}% Correct
          </p>
        </div>

        {/* AI Performance Feedback Section */}
        <div className="card p-6 mb-8 border-border/80 shadow-xl bg-surface/90">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-violet-soft animate-spin text-amber" />
              <span className="label-eyebrow">Mistral AI Tutor Feedback</span>
            </div>
            {loadingFeedback && (
              <span className="text-[10px] font-mono text-muted animate-pulse">Generating...</span>
            )}
          </div>

          {loadingFeedback && (
            <div className="space-y-3 py-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {feedbackError && (
            <ErrorBanner message={feedbackError} onRetry={loadFeedback} />
          )}

          {feedback && !loadingFeedback && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="bg-raised/60 p-4 rounded-xl border border-border/60">
                <p className="font-semibold text-ink text-xs uppercase font-mono mb-1">Overall Analysis</p>
                <p className="text-muted text-sm">{feedback.overall_performance}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-emerald/5 p-4 rounded-xl border border-emerald/20">
                  <p className="font-semibold text-emerald text-xs uppercase font-mono mb-1">Strengths</p>
                  <p className="text-muted text-xs">{feedback.strengths}</p>
                </div>
                <div className="bg-amber/5 p-4 rounded-xl border border-amber/20">
                  <p className="font-semibold text-amber text-xs uppercase font-mono mb-1">Areas to Focus</p>
                  <p className="text-muted text-xs">{feedback.areas_to_improve}</p>
                </div>
              </div>

              {feedback.practical_suggestion && (
                <div className="bg-violet/10 p-4 rounded-xl border border-violet/30">
                  <p className="font-semibold text-violet-soft text-xs uppercase font-mono mb-1">Actionable Suggestion</p>
                  <p className="text-muted text-xs">{feedback.practical_suggestion}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-10">
          <Link to="/practice" className="btn-secondary flex-1 py-3 text-center text-sm font-semibold">
            Practice Again
          </Link>
          <Link to="/" className="btn-primary flex-1 py-3 text-center text-sm font-semibold flex items-center justify-center gap-1.5">
            <span>Back to Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Answer Breakdown */}
        {review && review.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="label-eyebrow">Question Review</span>
              <span className="text-xs text-muted font-mono">{review.length} Questions</span>
            </div>

            <div className="space-y-4">
              {review.map((r, idx) => (
                <div key={idx} className="card p-5 border-border/80 shadow-md">
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
