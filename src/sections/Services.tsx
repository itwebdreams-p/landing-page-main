import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { serviceCards } from '@/data/home'

/** Bento layout: wide and narrow cards alternate so the grid has rhythm. */
const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7']

export function Services() {
  return (
    <Section id="services" tone="mist" labelledBy="services-title">
      <SectionHeading id="services-title" title="Our Services" description="Road freight, dedicated trucks, storage and distribution, planned by one team around your load." />
      <ul className="grid gap-5 lg:grid-cols-12">
        {serviceCards.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 80} className={spans[i]}>
            <a href="#booking" className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl bg-night shadow-sm transition duration-500 ease-brand hover:-translate-y-1 hover:shadow-lg lg:min-h-[26rem]">
              <img src={s.image} alt={s.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-brand group-hover:scale-105" />
              <span className="absolute inset-0 bg-linear-to-t from-night/95 via-night/40 to-night/5" aria-hidden="true" />
              <span className="absolute top-5 left-5 grid size-12 place-items-center rounded-2xl bg-gold text-white shadow-lg"><s.icon size={24} strokeWidth={1.75} aria-hidden="true" /></span>
              <span className="absolute top-5 right-5 grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-white"><ArrowUpRight size={18} aria-hidden="true" /></span>
              <span className="relative flex flex-col gap-2 p-7 text-white">
                <h3 className="font-display text-[1.75rem] leading-tight font-bold tracking-tight text-white">{s.title}</h3>
                <p className="max-w-[44ch] text-[0.98rem] leading-snug text-white/75">{s.description}</p>
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
