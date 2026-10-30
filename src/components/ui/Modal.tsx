import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'

const EXIT_MS = 220
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id of the heading inside the modal, for screen readers */
  labelledBy: string
  /** set true when the top of the modal has a dark background */
  closeOnDark?: boolean
  children: ReactNode
}

export function Modal({ open, onClose, labelledBy, closeOnDark = false, children }: ModalProps) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  // Keep the modal in the DOM while the exit animation plays.
  useEffect(() => {
    if (open) {
      if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement | null
      setMounted(true)
      setClosing(false)
      return
    }
    if (!mounted) return
    setClosing(true)
    const timer = window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
      returnFocus.current?.focus?.()
      returnFocus.current = null
    }, EXIT_MS)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useLockBodyScroll(mounted)
  useEscapeKey(open, onClose)

  // Stop the page from jumping sideways when the scrollbar disappears.
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const previous = root.style.getPropertyValue('scrollbar-gutter')
    root.style.setProperty('scrollbar-gutter', 'stable')
    return () => { root.style.setProperty('scrollbar-gutter', previous) }
  }, [mounted])

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (!mounted || !open) return
    const dialog = dialogRef.current
    if (!dialog) return
    const wantsKeyboard = window.matchMedia('(pointer: fine)').matches
    const target = wantsKeyboard ? dialog.querySelector<HTMLElement>('[data-autofocus]') : null
    ;(target ?? dialog).focus({ preventScroll: true })
  }, [mounted, open])

  if (!mounted) return null

  // Keep Tab / Shift+Tab inside the dialog.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((n) => n.offsetParent !== null)
    if (!nodes.length) { e.preventDefault(); return }
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === dialogRef.current)) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
  }

    return createPortal(
    <div
      className={`fixed inset-0 z-[300] grid place-items-center bg-[rgb(14_24_22/0.62)] p-5 backdrop-blur-[6px] max-sm:items-end max-sm:p-0 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        className={`relative max-h-[calc(100dvh-2.5rem)] w-[min(100%,440px)] overflow-y-auto overscroll-contain rounded-xl bg-surface text-charcoal shadow-lg focus:outline-none max-sm:max-h-[94dvh] max-sm:w-full max-sm:rounded-b-none max-sm:pb-[env(safe-area-inset-bottom,0px)] ${closing ? 'animate-modal-out max-sm:animate-sheet-out' : 'animate-modal-in max-sm:animate-sheet-in'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <button
          type="button"
          className={`absolute top-3.5 right-3.5 z-[2] grid size-[38px] place-items-center rounded-full transition duration-200 ease-brand hover:rotate-90 ${closeOnDark ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-mist text-ink'}`}
          aria-label="Close"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}