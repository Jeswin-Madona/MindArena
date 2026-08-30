import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm card p-6 bg-surface border-border shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-muted hover:text-ink transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2.5 rounded-xl ${
              isDangerous
                ? 'bg-rose/20 text-rose border border-rose/40'
                : 'bg-amber/20 text-amber border border-amber/40'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        </div>

        <p className="text-muted text-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 py-2.5 text-sm">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
              isDangerous
                ? 'bg-rose hover:bg-rose/90 text-white'
                : 'bg-amber hover:bg-amber-soft text-void font-bold'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
