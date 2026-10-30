import type { LucideIcon } from 'lucide-react'

interface IconBadgeProps { icon: LucideIcon; tone?: 'brand' | 'dark' | 'glass'; size?: number; className?: string }

const tones = {
  brand: 'bg-brand-50 text-brand-ink',
  dark: 'bg-charcoal text-white',
  glass: 'border border-white/10 bg-white/[0.06] text-brand-300',
}

export function IconBadge({ icon: Icon, tone = 'brand', size = 24, className = '' }: IconBadgeProps) {
  return (
    <span className={`inline-grid size-13 shrink-0 place-items-center rounded-lg ${tones[tone]} ${className}`.trim()} aria-hidden="true">
      <Icon size={size} strokeWidth={1.75} />
    </span>
  )
}