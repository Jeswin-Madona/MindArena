import { useEffect, useState } from 'react'
import { Swords, Sparkles, Loader2 } from 'lucide-react'

export default function LoadingScreen({
  label = 'Loading...',
  messages = [],
  fullScreen = true,
  subtext = 'Please wait a few seconds while we communicate with the server.',
}) {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    if (!messages || messages.length === 0) return
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [messages])

  const currentMessage = messages.length > 0 ? messages[msgIdx] : label

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto">
      {/* Animated Glowing Logo / Spinner */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-violet/10 border border-violet/30 flex items-center justify-center shadow-xl shadow-violet/20 animate-pulse">
          <Swords className="text-violet-soft animate-bounce" size={36} />
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet/20 via-amber/20 to-violet/20 blur-lg animate-spin -z-10" />
      </div>

      {/* Dynamic Status Title */}
      <div className="flex items-center gap-2 mb-2">
        <Loader2 className="animate-spin text-amber" size={18} />
        <h3 className="font-display text-lg font-bold text-ink tracking-tight">
          {currentMessage}
        </h3>
      </div>

      {/* Subtext info */}
      <p className="text-xs text-muted leading-relaxed max-w-xs">{subtext}</p>

      {/* Animated Dots Progress */}
      <div className="flex gap-1.5 mt-6">
        <div className="w-2 h-2 rounded-full bg-violet animate-ping" />
        <div className="w-2 h-2 rounded-full bg-amber animate-ping delay-150" />
        <div className="w-2 h-2 rounded-full bg-violet-soft animate-ping delay-300" />
      </div>
    </div>
  )

  if (!fullScreen) {
    return <div className="card border-border/80 bg-surface/90 shadow-xl my-6">{content}</div>
  }

  return (
    <div className="fixed inset-0 z-50 bg-void/90 backdrop-blur-md flex items-center justify-center p-4 transition-all">
      {content}
    </div>
  )
}
