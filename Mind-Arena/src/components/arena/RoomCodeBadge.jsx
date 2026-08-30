import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function RoomCodeBadge({ code }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  function handleCopy() {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success(`Room code ${code} copied to clipboard!`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="ticket shadow-2xl">
      <span className="label-eyebrow mb-2">Room Code</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-4xl sm:text-5xl font-bold tracking-[0.15em] text-amber selection:bg-amber selection:text-void">
          {code}
        </span>
        <button
          onClick={handleCopy}
          className="p-2.5 rounded-xl bg-void border border-border hover:border-amber transition-colors flex items-center justify-center shadow-md active:scale-95"
          aria-label="Copy room code"
          title="Copy room code"
        >
          {copied ? <Check size={20} className="text-emerald" /> : <Copy size={20} className="text-muted hover:text-amber" />}
        </button>
      </div>
      <span className="text-xs text-muted mt-2 font-mono">Share code for players to join</span>
    </div>
  )
}
