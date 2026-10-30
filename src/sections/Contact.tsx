import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { company } from '@/data/content'

/** Open now? Mon to Sat, 8 am to 8 pm India time. Update if `company.hours` changes. */
function useOpenNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date())
  const day = parts.find((p) => p.type === 'weekday')?.value
  const hour = Number(parts.find((p) => p.type === 'hour')?.value) % 24
  return day !== 'Sun' && hour >= 8 && hour < 20
}

interface Channel { icon: LucideIcon; label: string; value: string; href: string; external?: boolean }
const channels: Channel[] = [
  { icon: Phone, label: 'Call us', value: company.phone, href: company.phoneHref },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with our team', href: `https://wa.me/${company.whatsapp}`, external: true },
  { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
  { icon: MapPin, label: 'Visit our office', value: company.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`, external: true },
]

export function Contact() {
  const open = useOpenNow()
  return (
    <Section id="contact" tone="mist" labelledBy="contact-title">
      <SectionHeading
        id="contact-title"
        title="Contact Shankh Logistics"
        description="Questions about a shipment, a contract or warehousing? Reach us any way you like. To book a vehicle, use the booking form above."
      />
      <Reveal className="grid items-stretch gap-5 lg:grid-cols-[0.95fr_1.3fr]">
        <aside className="relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl bg-linear-to-br from-[#0f4b42] via-night to-[#0a1213] p-[clamp(1.5rem,3vw,2.25rem)] text-white shadow-lg">
          <div aria-hidden="true" className="absolute -right-24 -bottom-24 -z-10 size-72 rounded-full bg-brand/30 blur-[90px]" />
          <div>
            <p className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${open ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200' : 'border-white/15 bg-white/5 text-white/70'}`}>
              <span className="relative flex size-2.5"><span className={`absolute inline-flex size-full rounded-full ${open ? 'bg-emerald-300 motion-safe:animate-ping' : 'bg-white/40'}`} /><span className={`relative inline-flex size-2.5 rounded-full ${open ? 'bg-emerald-300' : 'bg-white/50'}`} /></span>
              {open ? 'Our team is online now' : 'Office closed, we reply when we open'}
            </p>
            <h3 className="mt-4 text-2xl text-white">Talk to a real person</h3>
            <p className="mt-2 text-white/70">No call centre. Your trip manager picks up.</p>
          </div>

          <ul className="grid gap-2.5">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 backdrop-blur transition duration-300 ease-brand hover:border-brand-300/50 hover:bg-white/[0.09]">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/25 text-brand-300 transition-colors duration-300 group-hover:bg-brand group-hover:text-white"><Icon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[0.8rem] text-white/55">{label}</span>
                    <span className="font-display font-semibold [overflow-wrap:anywhere]">{value}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-white/40 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-auto flex items-center gap-3 border-t border-white/10 pt-5 text-[0.92rem] text-white/70"><Clock3 size={18} className="shrink-0 text-brand-300" aria-hidden="true" />{company.hours}</p>
        </aside>

        <div className="rounded-3xl border border-line bg-surface p-[clamp(1.5rem,3.5vw,2.75rem)] shadow-md">
          <h3 className="mb-1 text-2xl">Send us a message</h3>
          <p className="mb-6 text-muted">Tell us what you need and we will call you back.</p>
          <ContactForm />
        </div>
      </Reveal>
    </Section>
  )
}
