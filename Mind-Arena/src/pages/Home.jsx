import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, LogIn, BookOpen, Trophy, ArrowRight, Zap, Flame, Shield, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quickCode, setQuickCode] = useState('')

  function handleQuickJoin(e) {
    e.preventDefault()
    if (!quickCode.trim()) return
    navigate('/arena/join')
  }

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-10">
        {/* Welcome Hero Banner */}
        <div className="relative card p-8 sm:p-10 mb-10 overflow-hidden bg-arena-glow border-violet/30 shadow-2xl">
          <div className="max-w-2xl z-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 border border-violet/40 text-violet-soft text-xs font-mono mb-4">
              <Sparkles size={14} className="animate-spin text-amber" />
              <span>Real-Time AI Arena Platform</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-ink tracking-tight mb-3 leading-tight">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-soft via-amber to-emerald">
                {user?.full_name || 'Player'}
              </span>
            </h1>

            <p className="text-muted text-base sm:text-lg mb-8 leading-relaxed">
              Challenge opponents in live AI-generated quiz battles, test your knowledge, or practice solo to master any subject.
            </p>

            {/* Quick Room Code Input Box */}
            <form onSubmit={handleQuickJoin} className="flex items-center gap-2 max-w-md bg-void/90 p-1.5 rounded-2xl border border-border/80 shadow-lg">
              <input
                type="text"
                value={quickCode}
                onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-char room code..."
                maxLength={8}
                className="w-full bg-transparent px-4 py-2.5 text-ink font-mono uppercase font-bold text-sm outline-none placeholder:text-muted/60"
              />
              <button
                type="submit"
                className="btn-amber text-xs py-2.5 px-4 flex items-center gap-1.5 shrink-0 shadow-md"
              >
                <span>Join</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Main Action Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {/* Create Room Card */}
          <Link
            to="/arena/create"
            className="card p-7 hover:border-violet-soft/80 transition-all duration-300 group relative overflow-hidden bg-surface/90 shadow-xl hover:shadow-2xl hover:shadow-violet/10 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet/20 border border-violet/40 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
              <Plus className="text-violet-soft" size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl font-bold text-ink group-hover:text-violet-soft transition-colors">
                Create Battle Room
              </h2>
              <ArrowRight size={20} className="text-muted group-hover:text-violet-soft group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Select topic, difficulty, and question parameters. Get a shareable code to host live multiplayer contests.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-soft uppercase tracking-wider font-semibold">
              <Zap size={12} className="text-amber" />
              <span>Multiplayer Battle</span>
            </span>
          </Link>

          {/* Join Room Card */}
          <Link
            to="/arena/join"
            className="card p-7 hover:border-amber/80 transition-all duration-300 group relative overflow-hidden bg-surface/90 shadow-xl hover:shadow-2xl hover:shadow-amber/10 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber/20 border border-amber/40 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
              <LogIn className="text-amber" size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl font-bold text-ink group-hover:text-amber transition-colors">
                Join Contest
              </h2>
              <ArrowRight size={20} className="text-muted group-hover:text-amber group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Enter a 6-character room code from your host and jump straight into the lobby to compete.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber uppercase tracking-wider font-semibold">
              <Flame size={12} className="text-amber" />
              <span>Instant Entrance</span>
            </span>
          </Link>
        </div>

        {/* Solo Practice Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-violet-soft" />
            <span className="label-eyebrow">Solo Mastery</span>
          </div>
        </div>

        <Link
          to="/practice"
          className="card p-6 flex items-center justify-between hover:border-border transition-all duration-300 bg-surface/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-dim/80 border border-violet/30 flex items-center justify-center text-violet-soft shrink-0">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-ink text-base mb-0.5 group-hover:text-violet-soft transition-colors">
                AI Solo Practice Quiz
              </h3>
              <p className="text-muted text-xs sm:text-sm">
                Generate custom quizzes on demand and receive instant AI performance analysis.
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="text-muted group-hover:text-violet-soft group-hover:translate-x-1 transition-all shrink-0 ml-4" />
        </Link>
      </main>
    </div>
  )
}
