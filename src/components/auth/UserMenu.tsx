import { useCallback, useEffect, useRef, useState } from 'react'
import { CalendarCheck, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEscapeKey } from '@/hooks/useEscapeKey'

const item =
  'flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[0.95rem] font-semibold text-charcoal transition-colors duration-150 hover:bg-brand-50 hover:text-brand-ink'

/** Avatar button + dropdown shown in the header after login. */
export function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEscapeKey(open, close)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) close() }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, close])

  if (!user) return null
  const firstName = user.name.split(' ')[0]

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/40 py-1 pr-3 pl-1 font-display text-[0.92rem] font-semibold transition duration-200 ease-brand group-data-[solid=true]/header:border-line hover:border-brand max-sm:p-1"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand text-[0.9rem] font-bold text-white" aria-hidden="true">
          {user.name.trim().charAt(0).toUpperCase()}
        </span>
        <span className="max-sm:hidden">{firstName}</span>
        <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ease-brand max-sm:hidden ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 z-10 w-[250px] origin-top-right animate-pop rounded-lg border border-line bg-surface p-1.5 text-ink shadow-lg" role="menu">
          <div className="mb-1 flex flex-col gap-0.5 border-b border-line px-3 pt-3 pb-3.5">
            <strong className="font-display text-[0.98rem]">{user.name}</strong>
            <span className="text-sm [overflow-wrap:anywhere] text-muted">{user.email || `+91 ${user.phone}`}</span>
          </div>
          <a href="#booking" role="menuitem" className={item} onClick={close}>
            <CalendarCheck size={18} aria-hidden="true" /> Book a shipment
          </a>
          <button type="button" role="menuitem" className={item} onClick={() => { close(); signOut() }}>
            <LogOut size={18} aria-hidden="true" /> Log out
          </button>
        </div>
      )}
    </div>
  )
}