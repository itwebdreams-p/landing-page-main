import { useEffect, useRef } from 'react'

/** Thin teal bar at the top that fills as the page is read. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      ref.current?.style.setProperty('transform', `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`)
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[150] h-[3px]"><div ref={ref} className="h-full origin-left scale-x-0 bg-linear-to-r from-brand-600 via-brand to-brand-300" /></div>
}
