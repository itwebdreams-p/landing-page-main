import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center' | 'stack'
  action?: ReactNode
  /** Remove the bottom margin (when the heading sits inside its own grid). */
  flush?: boolean
  className?: string
}

export function SectionHeading({ id, title, description, align = 'left', action, flush = false, className = '' }: SectionHeadingProps) {
  const layouts = {
    center: 'flex-col items-center text-center',
    stack: 'flex-col items-start',
    left: 'flex-col items-start sm:flex-row sm:items-end sm:justify-between',
  }
  const layout = layouts[align]

  return (
    <header className={`flex gap-8 ${flush ? '' : 'mb-[clamp(2rem,4vw,3.25rem)]'} ${layout} ${className}`.trim()}>
      <div className="max-w-2xl">
        <span aria-hidden="true" className="mb-5 flex items-center gap-2"><i className="size-2.5 rounded-full bg-gold" /><i className="h-0.5 w-14 bg-[repeating-linear-gradient(90deg,var(--color-gold)_0_7px,transparent_7px_12px)]" /></span>
        <h2 id={id}>{title}</h2>
        {description && (
          <p className="mt-4 text-muted group-data-[tone=dark]/section:text-white/70">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}