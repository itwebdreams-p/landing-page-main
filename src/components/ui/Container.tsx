import type { ElementType, ReactNode } from 'react'

interface ContainerProps { children: ReactNode; as?: ElementType; className?: string }

export function Container({ children, as: Tag = 'div', className = '' }: ContainerProps) {
  return <Tag className={`mx-auto w-full max-w-site px-gutter ${className}`.trim()}>{children}</Tag>
}