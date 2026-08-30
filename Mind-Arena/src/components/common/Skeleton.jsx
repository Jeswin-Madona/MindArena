export default function Skeleton({ className = 'h-4 w-full', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-raised/80 border border-border/40 rounded-xl animate-pulse ${className}`}
        />
      ))}
    </>
  )
}
