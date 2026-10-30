import { useState } from 'react'

interface PhotoProps {
  src: string
  alt: string
  /** CSS aspect-ratio, e.g. "4 / 3". Omit to fill the parent. */
  ratio?: string
  priority?: boolean
  className?: string
  position?: string
}

/** Image with reserved space, lazy loading and a calm fallback if the file fails to load. */
export function Photo({ src, alt, ratio, priority = false, className = '', position = 'center' }: PhotoProps) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br from-charcoal to-brand-900 ${className}`.trim()}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          style={{ objectPosition: position }}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}