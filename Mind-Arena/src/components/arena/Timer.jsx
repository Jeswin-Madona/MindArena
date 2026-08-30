import { Clock } from 'lucide-react'

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer({ seconds }) {
  return (
    <div className="flex items-center gap-2 font-mono text-lg font-semibold text-amber bg-raised border border-border rounded-xl px-4 py-2">
      <Clock size={18} />
      {formatTime(seconds)}
    </div>
  )
}
