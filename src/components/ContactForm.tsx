import { useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { submitContact } from '@/services/contact'
import type { ContactPayload } from '@/types'

const topics = ['General enquiry', 'Corporate or contract freight', 'Warehousing', 'Existing shipment', 'Feedback', 'Careers']
const empty: ContactPayload = { name: '', phone: '', email: '', topic: topics[0], message: '' }

type Errors = Partial<Record<keyof ContactPayload, string>>

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  const bind = (key: keyof ContactPayload) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      setErrors((x) => ({ ...x, [key]: undefined }))
    },
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found: Errors = {}
    if (values.name.trim().length < 2) found.name = 'Enter your name.'
    const digits = values.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
    if (!/^[6-9]\d{9}$/.test(digits)) found.phone = 'Enter a valid 10-digit mobile number.'
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) found.email = 'Enter a valid email address.'
    if (values.message.trim().length < 10) found.message = 'Tell us a little more (at least 10 characters).'
    setErrors(found)
    if (Object.keys(found).length) return
    setStatus('sending')
    await submitContact(values)
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-start gap-4 py-4" role="status">
        <CheckCircle2 size={44} className="text-brand" aria-hidden="true" />
        <h3>Message sent</h3>
        <p className="text-muted">Thank you, {values.name.split(' ')[0]}. Someone from our team will reach you on {values.phone} soon.</p>
        <Button variant="outline" onClick={() => { setValues(empty); setStatus('idle') }}>Send another message</Button>
      </div>
    )
  }

  return (
    <form className="grid gap-[1.1rem]" onSubmit={onSubmit} noValidate>
      <div className="grid gap-[1.1rem] sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" placeholder="Your name" {...bind('name')} />
        <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...bind('phone')} />
      </div>
      <div className="grid gap-[1.1rem] sm:grid-cols-2">
        <TextField label="Email" type="email" autoComplete="email" placeholder="you@company.com" hint="Optional" {...bind('email')} />
        <SelectField label="Topic" {...bind('topic')}>
          {topics.map((t) => <option key={t}>{t}</option>)}
        </SelectField>
      </div>
      <TextAreaField label="Message" rows={5} placeholder="How can we help?" {...bind('message')} />
      <div>
        <Button type="submit" size="lg" disabled={status === 'sending'} icon={status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}>
          {status === 'sending' ? 'Sending' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}