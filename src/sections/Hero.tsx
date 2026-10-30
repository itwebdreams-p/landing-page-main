import { useEffect, useState } from 'react'
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Headset, LocateFixed, Pause, Play, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { services } from '@/data/content'
import { heroSlides, heroVideo } from '@/data/images'

const assurances = [
  { icon: LocateFixed, text: 'GPS-tracked vehicles' },
  { icon: BadgeCheck, text: 'Verified drivers' },
  { icon: Headset, text: 'Trip support by phone and WhatsApp' },
]
const INTERVAL = 6500

/** Background slider (or video, see data/images.ts). Crossfades, pauses on request, respects reduced motion. */
function useSlider(count: number) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (!playing || count < 2) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => window.clearTimeout(t)
  }, [playing, index, count])
  return { index, playing, setPlaying, go: (n: number) => setIndex((n + count) % count) }
}

export function Hero() {
  const { index, playing, setPlaying, go } = useSlider(heroSlides.length)
  const current = heroSlides[index]

  return (
    <section id="top" aria-labelledby="hero-title" aria-roledescription="carousel" className="relative isolate flex min-h-[min(100svh,58rem)] flex-col justify-end overflow-hidden bg-night pt-[calc(var(--spacing-header)+5rem)] text-white nav:pt-[calc(var(--spacing-header)+var(--spacing-topbar)+5rem)]">
      {heroVideo ? (
        <video src={heroVideo} poster={heroSlides[0].src} autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover" />
      ) : (
        heroSlides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt=""
            aria-hidden="true"
            fetchPriority={i === 0 ? 'high' : 'low'}
            decoding="async"
            className={`absolute inset-0 -z-20 size-full object-cover object-[50%_60%] transition-opacity duration-[1400ms] ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'} ${i === index && playing ? 'motion-safe:scale-[1.06]' : ''} transition-[opacity,scale] [transition-duration:1400ms,7s]`}
          />
        ))
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#07302a]/95 via-night/70 to-night/30" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-linear-to-t from-night/95 to-transparent" aria-hidden="true" />

      <Container className="pb-[clamp(2.5rem,6vw,4.5rem)]">
        <h1 id="hero-title" className="max-w-[11ch] text-white motion-safe:animate-rise [animation-delay:150ms]">
          Driving Your Business <span className="bg-linear-to-r from-brand-300 to-brand bg-clip-text text-transparent">Forward.</span>
        </h1>
        <p className="mt-7 max-w-[36rem] text-[1.15rem] text-white/80 motion-safe:animate-rise [animation-delay:280ms]">
          Road transportation, full truck load and warehousing from Lucknow. Book online in a few steps and get a confirmed rate from our team, not an auto-generated estimate.
        </p>
        <div className="mt-10 flex flex-wrap gap-3.5 motion-safe:animate-rise [animation-delay:410ms]">
          <Button variant="gold" href="#booking" size="lg" icon={<ArrowRight size={18} />}>Book a Shipment</Button>
          <Button href="#services" size="lg" variant="onDark">Explore Our Services</Button>
        </div>

        <div aria-hidden="true" className="mt-12 -mx-[var(--spacing-gutter)] overflow-hidden border-y border-white/10 bg-white/[0.04] py-3.5 backdrop-blur [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max gap-10 whitespace-nowrap font-display text-lg font-semibold text-white/70 motion-safe:animate-[marquee_38s_linear_infinite]">
            {[0, 1].flatMap((n) => services.map((s) => <span key={`${n}${s.title}`} className="inline-flex items-center gap-10">{s.title}<Truck size={16} className="text-brand-300" /></span>))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-9 gap-y-5 motion-safe:animate-rise [animation-delay:540ms]">
          <ul className="flex flex-wrap gap-x-9 gap-y-3 text-[0.95rem] text-white/80">
            {assurances.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2.5"><Icon size={18} className="text-brand-300" aria-hidden="true" />{text}</li>
            ))}
          </ul>
          {!heroVideo && (
            <div className="flex items-center gap-4" role="group" aria-label="Hero photo controls">
              <p className="hidden min-w-40 text-right text-sm font-semibold text-white/80 sm:block" aria-live="off">{current.title}</p>
              <ul className="flex items-center gap-2" aria-label="Choose photo">
                {heroSlides.map((s, i) => (
                  <li key={s.src}>
                    <button type="button" onClick={() => go(i)} aria-label={`Show ${s.title}`} aria-current={i === index} className="group grid h-6 w-9 place-items-center">
                      <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/25">
                        <span key={`${i === index}${index}`} className={`absolute inset-y-0 left-0 rounded-full bg-brand-300 ${i === index ? (playing ? 'w-full motion-safe:animate-[grow_6.5s_linear]' : 'w-full') : 'w-0'}`} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                {[{ l: 'Previous photo', i: ChevronLeft, f: () => go(index - 1) }, { l: playing ? 'Pause slideshow' : 'Play slideshow', i: playing ? Pause : Play, f: () => setPlaying((p) => !p) }, { l: 'Next photo', i: ChevronRight, f: () => go(index + 1) }].map(({ l, i: I, f }) => (
                  <button key={l} type="button" onClick={f} aria-label={l} className="grid size-10 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition-colors duration-200 hover:border-brand-300 hover:bg-brand"><I size={18} aria-hidden="true" /></button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
