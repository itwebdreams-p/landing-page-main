import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { AlertCircle, Briefcase, Building2, CheckCircle2, Loader2, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PasswordField, TextField } from '@/components/ui/Field'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '../context/AuthContext'
import { isValidEmail, isValidPhone, login, register } from '@/services/auth'
import type { AuthField } from '@/services/auth'
import type { AuthUser, AuthView, BookingRole } from '@/types'


type Errors = Partial<Record<AuthField, string>>

const formClass = 'flex animate-swap flex-col gap-4'
const tab = 'relative z-10 rounded-md px-2 py-2.5 font-display text-[0.92rem] font-semibold text-muted transition-colors duration-200 hover:text-ink aria-selected:text-ink'

const copy: Record<AuthView, { title: string; sub: string }> = {
  login: { title: 'Log in to Shankh', sub: 'Book shipments faster, with your contact details already filled in.' },
  register: { title: 'Create your account', sub: 'Register as a customer or broker and skip retyping your details on every booking.' },
}

/** Renders the modal. Mount once, near the top of the app. */
export function AuthModal() {
  const { modalOpen, closeAuth, view } = useAuth()
  return (
    <Modal open={modalOpen} onClose={closeAuth} labelledBy="auth-title" closeOnDark>
      <AuthDialog view={view} />
    </Modal>
  )
}

function AuthDialog({ view }: { view: AuthView }) {
  const { setView, signIn, closeAuth } = useAuth()
  const [welcome, setWelcome] = useState<{ user: AuthUser; isNew: boolean } | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // When the tab changes, put the cursor in the first field (desktop only, so phone keyboards don't pop up).
  useEffect(() => {
    if (welcome || !window.matchMedia('(pointer: fine)').matches) return
    bodyRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true })
  }, [view, welcome])

  // Close by itself shortly after a successful login / registration.
  useEffect(() => {
    if (!welcome) return
    const timer = window.setTimeout(closeAuth, 1800)
    return () => window.clearTimeout(timer)
  }, [welcome, closeAuth])

  const done = (user: AuthUser, isNew: boolean) => {
    signIn(user)
    setWelcome({ user, isNew })
  }

  const head = welcome
    ? { title: welcome.isNew ? 'Account created' : 'You’re logged in', sub: 'Your details are saved for your next booking.' }
    : copy[view]

    return (
    <div>
      <div className="relative bg-linear-to-br from-brand-900 to-brand-700 pt-6 pr-15 pb-5 pl-5 sm:pt-[1.6rem] sm:pr-16 sm:pb-6 sm:pl-7">
        <Logo variant="light" height={34} className="mb-[1.1rem]" />
        <h2 id="auth-title" className="text-[1.55rem] text-white">{head.title}</h2>
        <p className="mt-1.5 text-[0.95rem] leading-normal text-white/80">{head.sub}</p>
      </div>

      <div className="p-5 pb-6 sm:px-7 sm:pt-[1.4rem] sm:pb-7" ref={bodyRef}>
        {welcome ? (
          <div className="flex flex-col items-center gap-2.5 pt-2 pb-1 text-center" role="status">
            <span className="grid size-16 animate-badge place-items-center rounded-full bg-brand-50 text-brand-ink"><CheckCircle2 size={34} aria-hidden="true" /></span>
            <h3>{welcome.isNew ? 'Welcome' : 'Welcome back'}, {welcome.user.name.split(' ')[0]}</h3>
            <p className="mb-3 text-muted">You can now book a shipment in a few taps.</p>
            <Button fullWidth onClick={() => { closeAuth(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Book a shipment
            </Button>
          </div>
        ) : (
          <>
            <div className="group/tabs relative mb-5 grid grid-cols-2 rounded-md bg-mist p-1" role="tablist" aria-label="Account" data-view={view}>
              <span className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md bg-surface shadow-sm transition-transform duration-300 ease-brand group-data-[view=register]/tabs:translate-x-full" aria-hidden="true" />
              <button type="button" role="tab" id="tab-login" aria-selected={view === 'login'} aria-controls="auth-panel" className={tab} onClick={() => setView('login')}>
                Log in
              </button>
              <button type="button" role="tab" id="tab-register" aria-selected={view === 'register'} aria-controls="auth-panel" className={tab} onClick={() => setView('register')}>
                Register
              </button>
            </div>

            <div id="auth-panel" role="tabpanel" aria-labelledby={`tab-${view}`}>
              {view === 'login'
                ? <LoginForm onSuccess={(u) => done(u, false)} />
                : <RegisterForm onSuccess={(u) => done(u, true)} />}
            </div>

            <p className="mt-5 text-center text-[0.93rem] text-muted">
              {view === 'login' ? 'New to Shankh Logistics?' : 'Already have an account?'}{' '}
              <button type="button" className="font-bold text-ink underline decoration-accent decoration-2 underline-offset-[3px] hover:text-accent" onClick={() => setView(view === 'login' ? 'register' : 'login')}>
                {view === 'login' ? 'Create an account' : 'Log in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )

}

/* ------------------------------------------------------------------ */

function useFormHelpers() {
  const formRef = useRef<HTMLFormElement>(null)
  const focusInvalid = () =>
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
  return { formRef, focusInvalid }
}

function FormAlert({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-start gap-2 rounded-md border border-[#f3c9c0] bg-[#fdf0ed] px-3.5 py-3 text-[0.9rem] leading-snug text-[#a8321f]" role="alert">
      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> <span>{message}</span>
    </p>
  )
}

function SubmitIcon({ sending, children }: { sending: boolean; children: ReactNode }) {
  return sending ? <Loader2 size={18} className="animate-spin" /> : <>{children}</>
}

function LoginForm({ onSuccess }: { onSuccess: (user: AuthUser) => void }) {
  const [values, setValues] = useState({ identifier: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const { formRef, focusInvalid } = useFormHelpers()

  const bind = (key: 'identifier' | 'password') => ({
    value: values[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      if (errors[key] || errors.form) setErrors((er) => ({ ...er, [key]: undefined, form: undefined }))
    },
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return

    const found: Errors = {}
    const id = values.identifier.trim()
    if (!id) found.identifier = 'Enter your mobile number or email.'
    else if (id.includes('@') ? !isValidEmail(id) : !isValidPhone(id)) found.identifier = 'Enter a valid 10-digit mobile number or email.'
    if (!values.password) found.password = 'Enter your password.'
    setErrors(found)
    if (Object.keys(found).length) { focusInvalid(); return }

    setSending(true)
    const res = await login(values.identifier, values.password)
    if (res.ok) { onSuccess(res.user); return }
    setSending(false)
    setErrors({ [res.field]: res.message })
    focusInvalid()
  }

  return (
    <form ref={formRef} className={formClass} onSubmit={onSubmit} noValidate>
      <FormAlert message={errors.form} />
      <TextField label="Mobile number or email" autoComplete="username" placeholder="98765 43210 or you@company.in" data-autofocus {...bind('identifier')} />
      <PasswordField label="Password" autoComplete="current-password" placeholder="Your password" {...bind('password')} />
      <Button type="submit" size="lg" fullWidth disabled={sending} icon={<SubmitIcon sending={sending}><LogIn size={18} /></SubmitIcon>}>
        {sending ? 'Logging in' : 'Log in'}
      </Button>
    </form>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: (user: AuthUser) => void }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', password: '' })
  const [role, setRole] = useState<BookingRole>('customer')
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const { formRef, focusInvalid } = useFormHelpers()

  const bind = (key: keyof typeof values) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      if (errors[key] || errors.form) setErrors((er) => ({ ...er, [key]: undefined, form: undefined }))
    },
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return

    const found: Errors = {}
    if (values.name.trim().length < 2) found.name = 'Enter your full name.'
    if (!isValidPhone(values.phone)) found.phone = 'Enter a valid 10-digit mobile number.'
    if (values.email.trim() && !isValidEmail(values.email)) found.email = 'Enter a valid email address.'
    if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
      found.password = 'Use at least 8 characters with a letter and a number.'
    }
    setErrors(found)
    if (Object.keys(found).length) { focusInvalid(); return }

    setSending(true)
    const res = await register({ ...values, role })
    if (res.ok) { onSuccess(res.user); return }
    setSending(false)
    setErrors({ [res.field]: res.message })
    focusInvalid()
  }

  return (
    <form ref={formRef} className={formClass} onSubmit={onSubmit} noValidate>
      <FormAlert message={errors.form} />
      <RoleChoice value={role} onChange={setRole} />
      <TextField label="Full name" autoComplete="name" placeholder="Your name" data-autofocus {...bind('name')} />
      <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...bind('phone')} />
      <TextField label="Email" type="email" autoComplete="email" placeholder="you@company.in" hint="Optional" {...bind('email')} />
      <PasswordField label="Password" autoComplete="new-password" placeholder="Create a password" hint={errors.password ? undefined : 'At least 8 characters, with a letter and a number.'} {...bind('password')} />
      <Strength password={values.password} />
      <Button type="submit" size="lg" fullWidth disabled={sending} icon={<SubmitIcon sending={sending}><UserPlus size={18} /></SubmitIcon>}>
        {sending ? 'Creating account' : 'Create account'}
      </Button>
    </form>
  )
}

/* ------------------------------------------------------------------ */

const roleOptions: { id: BookingRole; label: string; hint: string; icon: typeof Building2 }[] = [
  { id: 'customer', label: 'Customer', hint: 'Company shipping goods', icon: Building2 },
  { id: 'broker', label: 'Broker', hint: 'Booking for a party', icon: Briefcase },
]

function RoleChoice({ value, onChange }: { value: BookingRole; onChange: (r: BookingRole) => void }) {
  return (
    <div role="radiogroup" aria-label="I am a" className="grid grid-cols-2 gap-2.5">
      {roleOptions.map(({ id, label, hint, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          onClick={() => onChange(id)}
          className="flex items-center gap-2.5 rounded-lg border-[1.5px] border-line px-3 py-2.5 text-left transition duration-200 ease-brand hover:border-ink/40 aria-checked:border-brand aria-checked:bg-mist"
        >
          <Icon size={18} className="shrink-0 text-muted" aria-hidden="true" />
          <span className="flex flex-col leading-tight">
            <strong className="font-display text-[0.9rem] text-ink">{label}</strong>
            <small className="text-[0.75rem] text-muted">{hint}</small>
          </span>
        </button>
      ))}
    </div>
  )
}

/** Simple 3-step strength hint: length, letters and numbers, then a symbol or 12+ characters. */
function Strength({ password }: { password: string }) {
  if (!password) return null
  const score = [password.length >= 8, /[A-Za-z]/.test(password) && /\d/.test(password), /[^A-Za-z0-9]/.test(password) || password.length >= 12].filter(Boolean).length
  const label = ['Too short', 'Weak', 'Good', 'Strong'][score]
  const color = ['bg-line', 'bg-[#c2412d]', 'bg-accent', 'bg-brand'][score]
  return (
    <div className="-mt-2 flex items-center gap-3" aria-live="polite">
      <div className="grid flex-1 grid-cols-3 gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((n) => <span key={n} className={`h-1 rounded-full transition-colors duration-300 ${score >= n ? color : 'bg-line'}`} />)}
      </div>
      <span className="text-xs font-semibold text-muted">{label}</span>
    </div>
  )
}
