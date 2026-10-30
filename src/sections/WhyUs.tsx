import { Reveal } from '@/components/ui/Reveal'
import { IconBadge } from '@/components/ui/IconBadge'
import { Section } from '@/components/ui/Section'
import { advantages } from '@/data/home'
import { images } from '@/data/images'

export function WhyUs() {
  return (
    <Section id="why" labelledBy="why-title">
      <div className="grid items-center gap-[clamp(2rem,6vw,6rem)] lg:grid-cols-2">
        <Reveal variant="left">
          <img
            src={images.warehouse}
            alt="Workers handling boxes on warehouse shelves"
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lg max-lg:aspect-[4/3]"
          />
        </Reveal>

        <Reveal variant="right">
          <h2 id="why-title">Why choose Shankh</h2>
          <p className="mt-5 max-w-[52ch] text-lg text-ink">Logistics is a promise made to your customer. These are the things we do to keep it.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {advantages.map((a) => (
              <li key={a.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition duration-300 ease-brand hover:border-brand/60 hover:shadow-md">
                <IconBadge icon={a.icon} tone="dark" className="size-11" />
                <h3>{a.title}</h3>
                <p className="text-[0.975rem] text-muted">{a.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
