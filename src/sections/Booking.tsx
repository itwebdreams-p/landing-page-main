import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { BookingForm } from '@/components/BookingForm'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { company } from '@/data/content'

const contactRows = [
  { icon: Phone, label: 'Call', value: company.phone, href: company.phoneHref },
  { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
  { icon: Clock3, label: 'Hours', value: company.hours },
  { icon: MapPin, label: 'Office', value: company.address },
]

export function Booking() {
  return (
    <Section id="booking" tone="mist" labelledBy="booking-title">
      <Reveal className="grid items-start gap-[clamp(1.25rem,3vw,2.5rem)] lg:grid-cols-[0.7fr_1.5fr]">
        <aside className="flex flex-col gap-5 rounded-3xl bg-linear-to-br from-[#0f5247] via-brand-900 to-night p-[clamp(1.75rem,3.5vw,2.75rem)] text-white/75 lg:sticky lg:top-28">
          <h2 id="booking-title" className="text-white">Book your shipment</h2>
          <p>Choose Customer or Broker booking, fill in the details and our team will call you back with a confirmed rate. Prefer to talk first? Reach us directly.</p>
          <ul className="mt-4 grid gap-5 border-t border-white/10 pt-6">
            {contactRows.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4">
                <Icon size={20} className="mt-1 shrink-0 text-brand-300" aria-hidden="true" />
                <div className="flex min-w-0 flex-col">
                  <span className="text-[0.8125rem] text-white/50">{label}</span>
                  {href ? <a href={href} className="font-semibold [overflow-wrap:anywhere] text-white transition-colors hover:text-brand-300">{value}</a> : <span className="text-white">{value}</span>}
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <div className="rounded-3xl border border-line bg-surface p-[clamp(1.5rem,3.5vw,2.75rem)] shadow-md">
          <BookingForm />
        </div>
      </Reveal>
    </Section>
  )
}
