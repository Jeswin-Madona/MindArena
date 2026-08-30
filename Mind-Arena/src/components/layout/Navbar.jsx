import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Swords, LogOut, BookOpen, Plus, LogIn, Menu, X, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ConfirmModal from '../common/ConfirmModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  async function confirmLogout() {
    setShowLogoutModal(false)
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className="border-b border-border/80 bg-surface/90 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-violet/20 border border-violet/40 rounded-xl p-2 transition-transform group-hover:scale-105 shadow-inner">
              <Swords size={20} className="text-violet-soft" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-ink block leading-tight">
                MindArena
              </span>
              <span className="text-[10px] font-mono text-violet-soft uppercase tracking-widest block -mt-0.5">
                AI Battle Arena
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1.5 bg-raised/50 p-1 rounded-xl border border-border/60">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/')
                    ? 'bg-violet text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/arena/create"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/arena/create')
                    ? 'bg-violet text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Plus size={14} />
                <span>Create Room</span>
              </Link>
              <Link
                to="/arena/join"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/arena/join')
                    ? 'bg-amber text-void font-bold shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <LogIn size={14} />
                <span>Join Code</span>
              </Link>
              <Link
                to="/practice"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/practice')
                    ? 'bg-violet text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <BookOpen size={14} />
                <span>Solo Practice</span>
              </Link>
            </nav>
          )}

          {/* User Profile & Logout */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-violet-dim flex items-center justify-center text-violet-soft font-bold text-xs border border-violet/30">
                  <User size={14} />
                </div>
                <span className="text-xs font-semibold text-ink max-w-[120px] truncate">
                  {user.full_name || 'Player'}
                </span>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-muted hover:text-rose transition-colors p-2 rounded-xl hover:bg-raised border border-transparent hover:border-border hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                title="Sign Out"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-raised border border-border text-muted hover:text-ink"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-xs py-2 px-4">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface px-5 py-4 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <div className="w-8 h-8 rounded-full bg-violet-dim flex items-center justify-center text-violet-soft font-bold text-xs">
                <User size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{user.full_name}</p>
                <p className="text-[10px] text-muted font-mono">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-raised border border-border text-xs font-semibold text-ink flex items-center gap-2"
              >
                <Swords size={16} className="text-violet-soft" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/arena/create"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-raised border border-border text-xs font-semibold text-ink flex items-center gap-2"
              >
                <Plus size={16} className="text-violet-soft" />
                <span>Create Room</span>
              </Link>
              <Link
                to="/arena/join"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-raised border border-border text-xs font-semibold text-ink flex items-center gap-2"
              >
                <LogIn size={16} className="text-amber" />
                <span>Join Code</span>
              </Link>
              <Link
                to="/practice"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-raised border border-border text-xs font-semibold text-ink flex items-center gap-2"
              >
                <BookOpen size={16} className="text-violet-soft" />
                <span>Practice</span>
              </Link>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setShowLogoutModal(true)
              }}
              className="w-full mt-2 p-3 rounded-xl bg-rose/10 border border-rose/30 text-rose text-xs font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out of MindArena?"
        confirmLabel="Sign Out"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        isDangerous
      />
    </>
  )
}
