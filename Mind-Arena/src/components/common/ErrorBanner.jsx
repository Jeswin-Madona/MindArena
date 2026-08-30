import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorBanner({ message, onRetry, className = '' }) {
  if (!message) return null
  return (
    <div className={`card border-rose/40 bg-rose/10 px-5 py-4 flex items-start gap-3 shadow-lg ${className}`}>
      <AlertTriangle className="text-rose shrink-0 mt-0.5" size={20} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink leading-relaxed font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose hover:text-white transition-colors bg-rose/20 border border-rose/40 px-3 py-1.5 rounded-lg mt-2.5"
          >
            <RefreshCw size={13} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  )
}
