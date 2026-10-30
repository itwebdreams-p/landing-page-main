import { useState } from 'react'
import { Menu, X, Phone, Mail, Clock3, MessageCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useTheme } from '@/hooks/useTheme'
import { Logo } from '@/components/ui/Logo'
import { UserMenu } from '@/components/auth/UserMenu'
import { company, navItems } from '@/data/content'
import { useAuth } from '../context/AuthContext'
import { useScrolled } from '@/hooks/useScrolled'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import type { AuthView } from '@/types'

const sectionIds = navItems.map((item) => item.href.slice(1))

const navLink =
  'relative whitespace-nowrap py-1.5 text-[0.95rem] font-semibold opacity-90 transition-opacity hover:opacity-100 aria-[current=true]:opacity-100 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-brand hover:after:scale-x-100 aria-[current=true]:after:scale-x-100'

export function Header() {
  const scrolled = useScrolled(12)
  const [open, setOpen] = useState(false)
  const { user, openAuth, signOut } = useAuth()
  const active = useActiveSection(sectionIds)
  const solid = scrolled || open
  const { theme } = useTheme()
  const logoVariant = solid && theme === 'light' ? 'dark' : 'light'
  const close = () => setOpen(false)

  useLockBodyScroll(open)
  useEscapeKey(open, close)

  const openFromMenu = (view: AuthView) => { close(); openAuth(view) }

  return (
    <header data-solid={solid} data-scrolled={scrolled} className="group/header fixed inset-x-0 top-0 z-100 text-white">
      {/* Utility bar: desktop only, folds away once the page scrolls */}
      <div className="hidden h-(--spacing-topbar) overflow-hidden bg-night-2/80 text-[0.82rem] text-white/75 transition-[height] duration-300 ease-brand nav:block group-data-[scrolled=true]/header:h-0">
        <Container className="flex h-full items-center justify-between">
          <ul className="flex items-center gap-6">
            <li className="flex items-center gap-2"><Clock3 size={14} className="text-brand-300" aria-hidden="true" />{company.hours}</li>
            <li><a className="flex items-center gap-2 hover:text-white" href={company.phoneHref}><Phone size={14} className="text-brand-300" aria-hidden="true" />{company.phone}</a></li>
            <li><a className="flex items-center gap-2 hover:text-white" href={`mailto:${company.email}`}><Mail size={14} className="text-brand-300" aria-hidden="true" />{company.email}</a></li>
          </ul>
          <a className="flex items-center gap-2 font-semibold hover:text-white" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={14} className="text-brand-300" aria-hidden="true" />Chat on WhatsApp
          </a>
        </Container>
      </div>

      <div className="h-header transition duration-300 ease-brand group-data-[solid=true]/header:bg-surface/85 group-data-[solid=true]/header:text-ink group-data-[solid=true]/header:shadow-[0_1px_0_var(--color-line),0_12px_30px_-18px_var(--c-shadow-strong)] group-data-[solid=true]/header:backdrop-blur-xl group-data-[solid=true]/header:backdrop-saturate-150">
        <Container className="flex h-full items-center justify-between gap-6">
          <a href="#top" className="inline-flex shrink-0" aria-label="Shankh Logistics, back to top" onClick={close}>
            <Logo height={46} variant={logoVariant} />
          </a>

          <nav className="hidden nav:block" aria-label="Primary">
            <ul className="flex gap-[clamp(0.9rem,1.5vw,2rem)]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={navLink} aria-current={active === item.href.slice(1) ? 'true' : undefined}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-[1.1rem]">
            <ThemeToggle />
            {user ? (
              <div className="hidden nav:block"><UserMenu /></div>
            ) : (
              <div className="hidden items-center gap-2.5 nav:flex">
                <button
                  type="button"
                  className="px-2.5 py-2 font-display text-[0.95rem] font-semibold whitespace-nowrap transition-colors hover:text-brand"
                  onClick={() => openAuth('login')}
                >
                  Log in
                </button>
                <Button variant={solid ? 'outline' : 'onDark'} onClick={() => openAuth('register')}>Register</Button>
              </div>
            )}

            <div className="hidden nav:block"><Button variant="gold" href="#booking">Book Shipment</Button></div>

            <button
              className="grid size-11 place-items-center nav:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-header flex h-[calc(100dvh-var(--spacing-header))] flex-col gap-6 overflow-y-auto bg-surface px-gutter pt-6 pb-8 text-ink nav:hidden!"
      >
        <nav aria-label="Mobile">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={close} className="block border-b border-line py-4 font-display text-xl font-semibold">{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {user ? (
          <div className="flex items-center justify-between gap-4 rounded-md bg-mist px-4 py-3.5 text-[0.95rem]">
            <span>Signed in as <strong>{user.name}</strong></span>
            <button type="button" className="inline-flex items-center gap-1.5 py-1.5 font-bold text-brand-ink" onClick={() => { close(); signOut() }}>
              <LogOut size={16} aria-hidden="true" /> Log out
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={() => openFromMenu('login')}>Log in</Button>
            <Button variant="outline" size="lg" onClick={() => openFromMenu('register')}>Register</Button>
          </div>
        )}

        <Button variant="gold" href="#booking" size="lg" fullWidth onClick={close}>Book Shipment</Button>
        <a className="inline-flex items-center justify-center gap-2 font-semibold text-brand-ink" href={company.phoneHref}>
          <Phone size={18} aria-hidden="true" /> {company.phone}
        </a>
      </div>
    </header>
  )
}