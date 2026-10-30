import { IconBadge } from '@/components/ui/IconBadge'
import { Photo } from '@/components/ui/Photo'
import { Section } from '@/components/ui/Section'
import { about } from '@/data/about'
import { images } from '@/data/images'

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid items-center gap-[clamp(2rem,6vw,6rem)] lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-5">
          <h2 id="about-title">{about.title}</h2>
          <p className="text-xl leading-relaxed font-medium text-ink">{about.lead}</p>
          <p className="max-w-160 text-muted">{about.body}</p>
        </div>
        <div className="relative before:absolute before:-top-4 before:-left-4 before:-z-10 before:size-full before:rounded-3xl before:border-2 before:border-brand/40 max-lg:before:hidden">
          <Photo src={images.warehouseAisle} alt="Long warehouse aisle with stacked shelving" ratio="4 / 3" className="rounded-3xl shadow-lg" />
          <img
            src="/logo-mark.svg"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-7 right-3 w-22 rounded-xl bg-white p-3.5 shadow-md lg:-right-5"
          />
        </div>
      </div>

      <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-[clamp(1.25rem,3vw,3rem)] md:grid-cols-3">
        {about.values.map((v) => (
          <li key={v.title} className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm transition duration-300 ease-brand hover:-translate-y-1 hover:border-brand/50 hover:shadow-md">
            <IconBadge icon={v.icon} />
            <div>
              <h3 className="mb-1.5">{v.title}</h3>
              <p className="text-muted">{v.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}