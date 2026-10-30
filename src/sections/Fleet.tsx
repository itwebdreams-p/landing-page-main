import { Check, Truck, Container, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { industries, vehicles } from '@/data/content'
import { infrastructure } from '@/data/home'
import { images } from '@/data/images'

/** Upper end of each capacity, in tonnes, to size the load bar. Matches `vehicles` in content.ts. */
const maxTonnes: Record<string, number> = { 'Mini truck': 1, '14–17 ft truck': 5, '19–24 ft truck': 10, '32 ft multi-axle': 18, 'Flatbed / trailer': 25 }
const SCALE = 25

export function Fleet() {
  return (
    <Section id="fleet" labelledBy="fleet-title">
      <SectionHeading
        id="fleet-title"
        title="Fleet and Infrastructure"
        description="Capacities below are typical. We confirm the exact vehicle and body type when we quote."
      />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        <Reveal as="li" variant="image" className="relative min-h-80 overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-3 lg:row-span-2">
          <img src={images.fleet} alt="Flatbed truck carrying heavy cargo on the highway" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover object-[50%_40%]" />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-night/90 via-night/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur"><Truck size={16} aria-hidden="true" /> GPS-tracked, driver-verified</span>
            <p className="mt-3 max-w-[28ch] font-display text-2xl leading-tight font-semibold">From a mini truck to a 25 tonne trailer, one team plans it.</p>
          </div>
        </Reveal>

        {vehicles.map((v, i) => {
          const t = maxTonnes[v.name] ?? 10
          return (
            <Reveal as="li" key={v.name} delay={i * 70} className={`group lg:col-span-3 ${i === vehicles.length - 1 ? 'sm:col-span-2 lg:col-span-6' : ''}`}>
              <article className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-6 transition duration-300 ease-brand hover:-translate-y-1 hover:border-brand/60 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-ink transition-colors duration-300 group-hover:bg-brand group-hover:text-white"><Container size={22} strokeWidth={1.75} aria-hidden="true" /></span>
                  <a href="#booking" aria-label={`Book a ${v.name}`} className="grid size-9 place-items-center rounded-full border border-line text-muted transition duration-200 hover:border-brand hover:bg-brand hover:text-white"><ArrowUpRight size={16} aria-hidden="true" /></a>
                </div>
                <h3 className="mt-5">{v.name}</h3>
                <p className="mt-1 font-display text-2xl font-bold tracking-tight text-brand-ink">{v.capacity}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-mist" role="img" aria-label={`Load capacity up to ${t} tonnes on a ${SCALE} tonne scale`}>
                  <span className="block h-full rounded-full bg-linear-to-r from-brand-300 to-brand" style={{ width: `${(t / SCALE) * 100}%` }} />
                </div>
                <p className="mt-4 text-[0.95rem] text-muted">{v.bestFor}</p>
              </article>
            </Reveal>
          )
        })}
      </ul>

      <div className="mt-[clamp(3.5rem,7vw,6rem)] grid items-center gap-[clamp(1.5rem,5vw,4.5rem)] lg:grid-cols-[1.2fr_0.9fr]">
        <Reveal className="order-2 lg:order-1">
          <h3 className="text-2xl">Warehousing and infrastructure</h3>
          <p className="mt-3 max-w-[50ch] text-muted">Stock waiting for a truck should not be waiting on a second vendor. Store with us, and we load the vehicle straight from the shelf.</p>
          <ul className="mt-6 grid gap-3.5">
            {infrastructure.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check size={18} strokeWidth={3} className="mt-0.5 size-6 shrink-0 rounded-full bg-brand p-1 text-white" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 mb-4 text-lg">Industries we move freight for</h3>
          <ul className="flex flex-wrap gap-2">
            {industries.map((i) => <li key={i} className="rounded-full border border-line bg-mist px-4 py-1.5 text-[0.9rem] font-semibold text-charcoal">{i}</li>)}
          </ul>
        </Reveal>
        <Reveal variant="image" className="order-1 lg:order-2">
          <img src={images.warehouseWide} alt="Warehouse with racked storage" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-md" />
        </Reveal>
      </div>
    </Section>
  )
}
