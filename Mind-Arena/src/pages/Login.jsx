import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Swords, Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword, loginAsDemo } = useAuth()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [forgotError, setForgotError] = useState(null)
  const [forgotSuccess, setForgotSuccess] = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)

    try {
      if (mode === 'signin') {
        await loginWithEmail(email.trim(), password)
      } else {
        const res = await signUpWithEmail(email.trim(), password, fullName.trim())
        if (res?.user && !res?.session) {
          setSuccessMsg('Account created! Please check your email to confirm your account.')
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgotSubmit(e) {
    e.preventDefault()
    setForgotError(null)

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.')
      return
    }

    setForgotSubmitting(true)

    try {
      await resetPassword(forgotEmail.trim())
      setForgotSuccess(true)
    } catch (err) {
      setForgotError(err.message || 'Could not send reset email. Verify your email address.')
    } finally {
      setForgotSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-void">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="flex items-center gap-3 mb-8 z-10">
        <div className="w-12 h-12 rounded-2xl bg-violet/20 border border-violet/40 flex items-center justify-center shadow-lg shadow-violet/10">
          <Swords className="text-violet-soft" size={24} />
        </div>
        <div className="text-left">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">MindArena</h1>
          <span className="label-eyebrow">Real-Time AI Quiz Battles</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md card p-8 z-10 shadow-2xl border-border/80 bg-surface/90 backdrop-blur-xl">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 bg-raised/70 p-1 rounded-xl mb-6 border border-border">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError(null)
              setSuccessMsg(null)
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-violet text-white shadow-md'
                : 'text-muted hover:text-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
              setSuccessMsg(null)
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-violet text-white shadow-md'
                : 'text-muted hover:text-ink'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose/10 border border-rose/30 text-rose text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald/10 border border-emerald/30 text-emerald text-sm flex items-start gap-2.5">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span className="flex-1">{successMsg}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3.5 text-muted" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jeswin Madona"
                  className="input-field pl-10"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3.5 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email)
                    setForgotError(null)
                    setForgotSuccess(false)
                    setShowForgotModal(true)
                  }}
                  className="text-xs text-violet-soft hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3.5 text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-muted hover:text-ink transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-violet/20"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-surface px-3 text-xs text-muted uppercase font-mono tracking-widest">
            or
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full bg-raised hover:bg-border text-ink font-semibold rounded-xl px-5 py-3 border border-border flex items-center justify-center gap-3 transition-colors shadow-sm mb-3"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 009 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Demo / Guest Login Button */}
        <button
          type="button"
          onClick={() => loginAsDemo(fullName.trim() || 'Demo Player')}
          className="w-full bg-violet/10 hover:bg-violet/20 text-violet-soft font-semibold rounded-xl px-5 py-3 border border-violet/30 flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Swords size={18} />
          <span>Quick Demo Access (Skip Auth)</span>
        </button>
      </div>

      <p className="text-xs text-muted mt-6 z-10 font-mono">
        MindArena · Secure Supabase Authentication
      </p>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm card p-6 bg-surface border-border shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-muted hover:text-ink"
            >
              <X size={20} />
            </button>

            <h2 className="font-display text-xl font-bold mb-2">Reset Password</h2>
            <p className="text-muted text-xs mb-5">
              Enter your email address and we'll send you a password reset link.
            </p>

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose/10 border border-rose/30 text-rose text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald/10 border border-emerald/30 text-emerald text-center">
                <CheckCircle2 size={32} className="mx-auto mb-2" />
                <p className="text-sm font-semibold">Check your inbox!</p>
                <p className="text-xs mt-1 opacity-90">
                  Password reset link sent to <strong>{forgotEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn-primary w-full mt-4 text-xs py-2"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-muted" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input-field pl-10"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn-secondary flex-1 text-xs py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5"
                  >
                    {forgotSubmitting ? 'Sending…' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
