import type { ElementType, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

type Variant = 'up' | 'left' | 'right' | 'image'

/* Full class strings so Tailwind can see them. Each variant: hidden state + the shared "in" state. */
const hidden: Record<Variant, string> = {
  up: 'translate-y-6',
  left: '-translate-x-8',
  right: 'translate-x-8',
  image: 'scale-[1.04] [clip-path:inset(0_0_8%_0)]',
}

interface RevealProps {
  children: ReactNode
  variant?: Variant
  /** Stagger in milliseconds */
  delay?: number
  as?: ElementType
  className?: string
}

/** Fades a block in once, when it scrolls into view. Honours prefers-reduced-motion (see useInView). */
export function Reveal({ children, variant = 'up', delay = 0, as: Tag = 'div', className = '' }: RevealProps) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      data-in={inView}
      style={{ transitionDelay: `${delay}ms` }}
      className={`opacity-0 transition-[opacity,translate,scale,clip-path] duration-[650ms] ease-brand data-[in=true]:translate-0 data-[in=true]:scale-100 data-[in=true]:opacity-100 data-[in=true]:[clip-path:inset(0)] ${hidden[variant]} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}
