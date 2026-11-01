import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { Briefcase, Building2, CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { cargoTypes, vehicles } from '@/data/content'
import { BookingError, loadBookingOptions, submitBooking } from '@/services/booking'
import { useAuth } from './context/AuthContext'
import { LocationPicker } from './LocationPicker'
import type { PickedLocation } from './LocationPicker'
import type { AuthUser, BookingPayload, BookingRole } from '@/types'
import type { BookingOptions, BookingResult } from '@/services/booking'

type Errors = Partial<Record<keyof BookingPayload, string>>
type TextKey = Exclude<keyof BookingPayload, 'role' | 'pickupLat' | 'pickupLng' | 'dropLat' | 'dropLng'>

const OTHER_CARGO = 'Other'
// Shown until the live lists arrive, and for good if the server cannot be reached.
const defaultOptions: BookingOptions = {
  cargoTypes: cargoTypes.filter((c) => c !== OTHER_CARGO),
  vehicles: vehicles.map((v) => ({ value: v.name, label: `${v.name} (${v.capacity})` })),
}

const today = () => new Date().toISOString().slice(0, 10)
const digits = (v: string) => v.replace(/\D/g, '')
const phoneDigits = (v: string) => digits(v).replace(/^91(?=\d{10}$)/, '')

const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
const PAN = /^[A-Z]{5}\d{4}[A-Z]$/

const emptyForm = (user: AuthUser | null, role: BookingRole): BookingPayload => ({
  role, companyName: '', name: user?.name ?? '', address: '', gst: '', pan: '', aadhaar: '',
  phone: user?.phone ?? '', email: user?.email ?? '',
  pickup: '', drop: '', pickupAddress: '', pickupLat: null, pickupLng: null, dropAddress: '', dropLat: null, dropLng: null,
  vehicle: '', cargo: '', cargoOther: '', date: '', weight: '', notes: '',
})

function validate(v: BookingPayload): Errors {
  const e: Errors = {}
  if (v.role === 'customer') {
    if (v.companyName.trim().length < 2) e.companyName = 'Enter the company name.'
    if (v.address.trim().length < 8) e.address = 'Enter the full company address.'
    if (!GSTIN.test(v.gst)) e.gst = 'Enter a valid 15-character GST number.'
    if (!PAN.test(v.pan)) e.pan = 'Enter a valid 10-character PAN, e.g. ABCDE1234F.'
    if (digits(v.aadhaar).length !== 12) e.aadhaar = 'Enter the 12-digit Aadhaar number of the director.'
  } else {
    if (v.name.trim().length < 2) e.name = 'Enter the broker name.'
    if (digits(v.aadhaar).length !== 12) e.aadhaar = 'Enter the 12-digit Aadhaar number.'
    if (v.address.trim().length < 8) e.address = 'Enter your full address.'
    if (!PAN.test(v.pan)) e.pan = 'Enter a valid 10-character PAN, e.g. ABCDE1234F.'
  }
  if (!/^[6-9]\d{9}$/.test(phoneDigits(v.phone))) e.phone = 'Enter a valid 10-digit mobile number.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!v.pickup.trim()) e.pickup = 'Search the pickup location, or enter its city.'
  if (!v.drop.trim()) e.drop = 'Search the delivery location, or enter its city.'
  if (!v.cargo) e.cargo = 'Select the type of cargo.'
  else if (v.cargo === OTHER_CARGO && !v.cargoOther.trim()) e.cargoOther = 'Write what the cargo is.'
  if (!v.date) e.date = 'Choose a pickup date.'
  else if (v.date < today()) e.date = 'Pickup date cannot be in the past.'
  return e
}

const roles: { id: BookingRole; label: string; hint: string; icon: typeof Building2 }[] = [
  { id: 'customer', label: 'Customer Booking', hint: 'Companies shipping their own goods', icon: Building2 },
  { id: 'broker', label: 'Broker Booking', hint: 'Booking on behalf of a party', icon: Briefcase },
]

const copy: Record<BookingRole, { title: string; sub: string }> = {
  customer: { title: 'Customer booking', sub: 'Share your company details and load. Our team calls back with a confirmed rate and vehicle plan.' },
  broker: { title: 'Broker booking', sub: 'Share your details and the load you are booking. We confirm the rate by phone before anything is booked.' },
}

function RoleTabs({ value, onChange }: { value: BookingRole; onChange: (role: BookingRole) => void }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = value === 'customer' ? 'broker' : 'customer'
    onChange(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="group/roles relative grid grid-cols-2 gap-1 rounded-lg bg-mist p-1" role="tablist" aria-label="Booking category" data-role={value} onKeyDown={onKeyDown}>
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-6px)] rounded-md bg-surface shadow-sm ring-[1.5px] ring-brand transition-transform duration-300 ease-brand group-data-[role=broker]/roles:translate-x-[calc(100%+4px)]"
      />
      {roles.map(({ id, label, hint, icon: Icon }) => (
        <button
          key={id}
          ref={(el) => { refs.current[id] = el }}
          type="button" role="tab" id={`role-${id}`}
          aria-selected={value === id} aria-controls="booking-form" tabIndex={value === id ? 0 : -1}
          className="group/tab relative z-10 flex items-center gap-3 rounded-md px-3.5 py-3 text-left text-muted transition-colors duration-200 hover:text-ink aria-selected:text-ink max-[560px]:flex-col max-[560px]:gap-1.5 max-[560px]:px-2 max-[560px]:text-center"
          onClick={() => onChange(id)}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface text-muted ring-1 ring-line transition-colors duration-200 group-aria-selected/tab:bg-brand group-aria-selected/tab:text-white group-aria-selected/tab:ring-brand">
            <Icon size={18} aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <strong className="font-display text-[0.95rem] font-semibold">{label}</strong>
            <small className="text-[0.78rem] text-muted max-[560px]:hidden">{hint}</small>
          </span>
        </button>
      ))}
    </div>
  )
}

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="grid gap-4 border-t border-line pt-6">
      <div>
        <h4 id={id} className="font-display text-base font-semibold text-ink">{title}</h4>
        {note && <p className="mt-0.5 text-sm text-muted">{note}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

const upper = (v: string) => v.toUpperCase().replace(/\s/g, '')
const aadhaarFmt = (v: string) => digits(v).slice(0, 12).replace(/(\d{4})(?=\d)/g, '$1 ')

export function BookingForm() {
  const { user } = useAuth()
  const [values, setValues] = useState<BookingPayload>(() => emptyForm(user, user?.role ?? 'customer'))
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [result, setResult] = useState<BookingResult | null>(null)
  const [sendError, setSendError] = useState('')
  const [website, setWebsite] = useState('')
  const [options, setOptions] = useState(defaultOptions)
  const isBroker = values.role === 'broker'

  useEffect(() => {
    let current = true
    loadBookingOptions().then((live) => {
      if (!current || !live) return
      const next = {
        cargoTypes: live.cargoTypes.length ? live.cargoTypes.filter((c) => c.toLowerCase() !== OTHER_CARGO.toLowerCase()) : defaultOptions.cargoTypes,
        vehicles: live.vehicles.length ? live.vehicles : defaultOptions.vehicles,
      }
      setOptions(next)
      // A choice made from the list shown first may not be on the live one.
      setValues((v) => ({
        ...v,
        cargo: v.cargo === OTHER_CARGO || next.cargoTypes.includes(v.cargo) ? v.cargo : '',
        vehicle: next.vehicles.some((option) => option.value === v.vehicle) ? v.vehicle : '',
      }))
    })
    return () => { current = false }
  }, [])

  // Fill in details for logged-in users (never overwrites what they typed).
  useEffect(() => {
    if (!user) return
    setValues((v) => ({
      ...v,
      name: v.name || user.name, phone: v.phone || user.phone, email: v.email || user.email,
      role: v.role === 'customer' && !v.companyName && user.role ? user.role : v.role,
    }))
  }, [user])

  const setPickup = (place: PickedLocation) => {
    setValues((v) => ({ ...v, pickup: place.city, pickupAddress: place.address, pickupLat: place.lat, pickupLng: place.lng }))
    setErrors((er) => ({ ...er, pickup: undefined }))
  }
  const setDrop = (place: PickedLocation) => {
    setValues((v) => ({ ...v, drop: place.city, dropAddress: place.address, dropLat: place.lat, dropLng: place.lng }))
    setErrors((er) => ({ ...er, drop: undefined }))
  }

  const bind = (key: TextKey, transform?: (v: string) => string) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: { target: { value: string } }) => {
      const next = transform ? transform(e.target.value) : e.target.value
      setValues((v) => ({ ...v, [key]: next }))
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
    },
  })

  const setRole = (role: BookingRole) => { setValues((v) => ({ ...v, role })); setErrors({}) }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      window.setTimeout(() => document.getElementById('booking-form')?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    setStatus('sending')
    setSendError('')
    const cargo = values.cargo === OTHER_CARGO ? values.cargoOther.trim() : values.cargo
    const payload: BookingPayload = isBroker ? { ...values, cargo, companyName: '', gst: '' } : { ...values, cargo, name: '' }
    try {
      setResult(await submitBooking(payload, website))
      setStatus('done')
    } catch (err) {
      setSendError(err instanceof BookingError ? err.message : 'We could not send your request. Please try again, or call us.')
      setStatus('idle')
    }
  }

  if (status === 'done' && result) {
    return (
      <div className="flex flex-col items-start gap-4 py-4" role="status">
        <CheckCircle2 size={44} className="text-brand" aria-hidden="true" />
        <h3>Booking request received</h3>
        <p className="max-w-[52ch] text-muted [&>strong]:text-ink">
          Reference <strong>{result.reference}</strong>. Our team will call <strong>{values.phone}</strong> shortly
          with a confirmed rate and vehicle plan.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button href={result.whatsappUrl} target="_blank" rel="noopener noreferrer" icon={<MessageCircle size={18} />}>Confirm on WhatsApp</Button>
          <Button variant="outline" onClick={() => { setValues(emptyForm(user, values.role)); setStatus('idle') }}>Book another shipment</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <RoleTabs value={values.role} onChange={setRole} />

      <div className="mt-8" aria-live="polite">
        <h3 key={values.role} className="animate-swap text-2xl">{copy[values.role].title}</h3>
        <p className="mt-1.5 max-w-[60ch] text-muted">{copy[values.role].sub}</p>
      </div>

      <form key={values.role} id="booking-form" className="mt-7 grid animate-swap gap-6" role="tabpanel" aria-labelledby={`role-${values.role}`} onSubmit={onSubmit} noValidate>
        {isBroker ? (
          <Group title="Broker details" note="We use these to verify the booking.">
            <TextField label="Broker name" autoComplete="name" placeholder="Full name" {...bind('name')} />
            <TextField label="Broker Aadhaar number" inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000" {...bind('aadhaar', aadhaarFmt)} />
            <div className="sm:col-span-2"><TextField label="Address" autoComplete="street-address" placeholder="Office address with city and PIN code" {...bind('address')} /></div>
            <TextField label="Contact number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...bind('phone')} />
            <TextField label="PAN number" placeholder="ABCDE1234F" maxLength={10} autoCapitalize="characters" spellCheck={false} {...bind('pan', upper)} />
            <div className="sm:col-span-2"><TextField label="Email ID" type="email" autoComplete="email" placeholder="you@company.in" {...bind('email')} /></div>
          </Group>
        ) : (
          <Group title="Company details" note="We use these to verify the booking.">
            <div className="sm:col-span-2"><TextField label="Company name" autoComplete="organization" placeholder="Registered company name" {...bind('companyName')} /></div>
            <div className="sm:col-span-2"><TextField label="Company address" autoComplete="street-address" placeholder="Registered address with city and PIN code" {...bind('address')} /></div>
            <TextField label="Company GST number" placeholder="22AAAAA0000A1Z5" maxLength={15} autoCapitalize="characters" spellCheck={false} {...bind('gst', upper)} />
            <TextField label="Company PAN number" placeholder="ABCDE1234F" maxLength={10} autoCapitalize="characters" spellCheck={false} {...bind('pan', upper)} />
            <TextField label="Director Aadhaar number" inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000" {...bind('aadhaar', aadhaarFmt)} />
            <TextField label="Contact number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...bind('phone')} />
            <div className="sm:col-span-2"><TextField label="Email ID" type="email" autoComplete="email" placeholder="accounts@company.in" {...bind('email')} /></div>
          </Group>
        )}

        <Group title="Shipment details">
          <div className="grid gap-6 sm:col-span-2 lg:grid-cols-2">
            <LocationPicker
              kind="pickup"
              value={{ address: values.pickupAddress, city: values.pickup, lat: values.pickupLat, lng: values.pickupLng }}
              onChange={setPickup}
              error={errors.pickup}
            />
            <LocationPicker
              kind="drop"
              value={{ address: values.dropAddress, city: values.drop, lat: values.dropLat, lng: values.dropLng }}
              onChange={setDrop}
              error={errors.drop}
            />
          </div>
          <SelectField label="Cargo type" {...bind('cargo')}>
            <option value="">Select cargo type</option>
            {options.cargoTypes.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value={OTHER_CARGO}>{OTHER_CARGO}</option>
          </SelectField>
          {values.cargo === OTHER_CARGO && (
            <TextField label="What is the cargo?" placeholder="e.g. Solar panels" maxLength={150} {...bind('cargoOther')} />
          )}
          <SelectField label="Vehicle" {...bind('vehicle')}>
            <option value="">Not sure yet</option>
            {options.vehicles.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
          </SelectField>
          <TextField label="Pickup date" type="date" min={today()} {...bind('date')} />
          <TextField label="Approx. weight" placeholder="e.g. 4 tonnes" hint="Optional" {...bind('weight')} />
          <div className="sm:col-span-2">
            <TextAreaField label="Anything we should know?" placeholder="Loading time, fragile items, special handling" hint="Optional" {...bind('notes')} />
          </div>
        </Group>

        {/* Hidden from people; bots fill it in, and the server then keeps nothing. */}
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} />

        <div className="grid gap-3">
          {sendError && <p className="text-sm text-red-600" role="alert">{sendError}</p>}
          <Button type="submit" size="lg" fullWidth disabled={status === 'sending'} icon={status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}>
            {status === 'sending' ? 'Sending request' : isBroker ? 'Request broker booking' : 'Request customer booking'}
          </Button>
          <p className="text-center text-sm text-muted">No payment needed now. We confirm the rate by phone before anything is booked.</p>
        </div>
      </form>
    </>
  )
}
