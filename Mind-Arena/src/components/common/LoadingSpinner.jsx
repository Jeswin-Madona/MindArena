import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <Loader2 className="animate-spin text-violet" size={32} />
      <p className="font-mono text-sm">{label}</p>
    </div>
  )
}
