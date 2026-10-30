import type { ReactNode } from 'react'
import { Container } from './Container'

type Tone = 'default' | 'mist' | 'dark'

interface SectionProps {
  id?: string
  tone?: Tone
  children: ReactNode
  className?: string
  labelledBy?: string
}

const tones: Record<Tone, string> = {
  default: '',
  mist: 'bg-mist bg-[radial-gradient(circle_at_1px_1px,rgb(32_163_141/0.10)_1px,transparent_0)] bg-[length:24px_24px]',
  dark: 'bg-night text-white/75 [&_h2]:text-white [&_h3]:text-white',
}

export function Section({ id, tone = 'default', children, className = '', labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={`group/section py-section ${tones[tone]} ${className}`.trim()}
    >
      <Container>{children}</Container>
    </section>
  )
}