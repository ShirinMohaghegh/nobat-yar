import { Star } from 'lucide-react'

export default function Stars({ count = 0 }) {
  const filled = Math.max(0, Math.min(5, Math.floor(count)))

  return (
    <div
      className="doctor-stars"
      role="img"
      aria-label={`${filled.toLocaleString('fa-IR')} از ۵ ستاره`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={14}
          strokeWidth={1.75}
          fill={index < filled ? 'var(--star)' : 'none'}
          stroke="var(--star)"
          aria-hidden="true"
        />
      ))}
    </div>
  )
}