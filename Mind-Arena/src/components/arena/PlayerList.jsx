import { Crown, User } from 'lucide-react'

export default function PlayerList({ players = [], maxPlayers = 10 }) {
  return (
    <div className="card p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse" />
          <span className="label-eyebrow">Players Joined</span>
        </div>
        <span className="font-mono text-sm font-semibold text-amber bg-raised px-2.5 py-1 rounded-lg border border-border">
          {players.length} / {maxPlayers}
        </span>
      </div>

      <ul className="space-y-2.5">
        {players.map((p, idx) => (
          <li
            key={p.id || p.user_id || `${p.player_name}-${idx}`}
            className="flex items-center gap-3 bg-raised border border-border/80 rounded-xl px-4 py-3 transition-all hover:border-violet-soft/50"
          >
            <div className="w-9 h-9 rounded-full bg-violet-dim/80 border border-violet-soft/30 flex items-center justify-center shrink-0 shadow-inner">
              <User size={18} className="text-violet-soft" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink truncate text-sm">{p.player_name}</p>
              {p.joined_at && (
                <p className="text-[10px] text-muted font-mono">
                  Joined {new Date(p.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            {p.is_host ? (
              <span className="flex items-center gap-1 text-xs font-bold text-amber bg-amber/10 border border-amber/30 px-2.5 py-1 rounded-md">
                <Crown size={14} />
                Host
              </span>
            ) : (
              <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded border border-border">
                Ready
              </span>
            )}
          </li>
        ))}

        {players.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted text-sm">Waiting for players to enter the room code…</p>
          </div>
        )}
      </ul>
    </div>
  )
}
