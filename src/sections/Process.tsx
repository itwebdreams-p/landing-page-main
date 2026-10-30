import { Truck } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { steps } from '@/data/content'
import { useInView } from '@/hooks/useInView'

export function Process() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  return (
    <Section id="process" tone="mist" labelledBy="process-title">
      <SectionHeading id="process-title" title="From first call to delivered, in four steps" description="You always know what happens next and who to call." />
      <div ref={ref} data-in={inView} className="group/steps">
        {/* The road: fills left to right as the section arrives, a truck rides its end */}
        <div aria-hidden="true" className="relative mb-5 hidden h-11 lg:block">
          <span className="absolute inset-x-[12.5%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
          <span className="absolute inset-x-[12.5%] top-1/2 h-1 origin-left -translate-y-1/2 scale-x-0 rounded-full bg-linear-to-r from-brand to-gold transition-transform duration-[2400ms] ease-brand group-data-[in=true]/steps:scale-x-100" />
          {steps.map((s, i) => <span key={s.title} style={{ left: `${12.5 + i * 25}%` }} className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-gold bg-page" />)}
          <span className="absolute top-1/2 left-[87.5%] grid size-10 -translate-x-1/2 -translate-y-1/2 scale-50 place-items-center rounded-full bg-gold text-white opacity-0 shadow-[0_0_0_6px_rgb(32_163_141/0.25)] transition duration-500 delay-[2300ms] group-data-[in=true]/steps:scale-100 group-data-[in=true]/steps:opacity-100"><Truck size={20} /></span>
        </div>
        <ol className="grid gap-5 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-3xl border border-line bg-surface p-7 shadow-sm transition duration-300 ease-brand hover:-translate-y-1 hover:border-brand/50 hover:shadow-md">
              <span className="mb-6 grid size-14 place-items-center rounded-2xl bg-night text-white shadow-lg"><step.icon size={26} strokeWidth={1.6} aria-hidden="true" /></span>
              <span aria-hidden="true" className="absolute top-5 right-6 font-display text-6xl leading-none font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--color-line)]">{i + 1}</span>
              <h3 className="mb-2.5 text-[1.3rem]">{step.title}</h3>
              <p className="text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
