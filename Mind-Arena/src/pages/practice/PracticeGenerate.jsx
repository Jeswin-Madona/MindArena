import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles, ArrowLeft, Sliders } from 'lucide-react'
import { api, ApiError } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import Navbar from '../../components/layout/Navbar'
import ErrorBanner from '../../components/common/ErrorBanner'
import LoadingScreen from '../../components/common/LoadingScreen'

const TOPICS = ['Python', 'JavaScript', 'Java', 'SQL', 'General Knowledge', 'Custom']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const AI_LOADING_MESSAGES = [
  'Connecting to Mistral AI server...',
  'Generating balanced quiz questions...',
  'Validating correct answer choices...',
  'Formatting explanations and storing quiz...',
  'Almost ready for practice...'
]

export default function PracticeGenerate() {
  const navigate = useNavigate()
  const toast = useToast()

  const [topic, setTopic] = useState('Python')
  const [customTopic, setCustomTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [numQuestions, setNumQuestions] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const resolvedTopic = topic === 'Custom' ? customTopic.trim() : topic

  async function handleSubmit(e) {
    e.preventDefault()
    if (!resolvedTopic) {
      setError('Please specify a topic for your solo practice quiz.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await api.generateQuiz({
        topic: resolvedTopic,
        difficulty,
        number_of_questions: Number(numQuestions)
      })

      if (!res?.quiz_id) {
        throw new Error('Quiz created, but server did not return a valid quiz ID.')
      }

      toast.success('Quiz generated successfully!')
      navigate(`/practice/quiz/${res.quiz_id}`, {
        state: { topic: resolvedTopic, difficulty, number_of_questions: Number(numQuestions) }
      })
    } catch (err) {
      const errMsg = err instanceof ApiError ? err.message : 'Could not generate the quiz. Check connection and n8n workflow.'
      setError(errMsg)
      toast.error('Quiz generation failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      {submitting && (
        <LoadingScreen
          messages={AI_LOADING_MESSAGES}
          subtext="Mistral AI is creating your custom questions. This usually takes 5-10 seconds."
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
            <BookOpen size={18} className="text-violet-soft" />
          </div>
          <span className="label-eyebrow">Solo Practice Arena</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Generate Practice Quiz</h1>
        <p className="text-muted text-sm mb-8">
          Configure a solo quiz to test your skills. AI will build your questions and evaluate your answers.
        </p>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} onRetry={handleSubmit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-6 shadow-2xl">
          {/* Topic */}
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
                placeholder="e.g. Data Structures, Ancient Greek Philosophy..."
                className="input-field mt-3"
                required
                autoFocus
              />
            )}
          </div>

          {/* Difficulty */}
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

          {/* Question Count */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
              Number of Questions
            </label>
            <input
              type="number"
              min={3}
              max={20}
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="input-field font-mono text-center text-lg font-bold"
            />
            <span className="text-[10px] text-muted mt-1 block text-center">Choose between 3 and 20 questions</span>
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
                <span>Generating Quiz with AI…</span>
              </div>
            ) : (
              <>
                <Sliders size={18} />
                <span>Generate Practice Quiz</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
