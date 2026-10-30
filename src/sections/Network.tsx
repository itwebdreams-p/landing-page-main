import { useState } from 'react'
import { ArrowRight, Radar, Route } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { MAP_H, MAP_W, corridors, coverage, hub, indiaOutline, project, straightKm } from '@/data/network'
import { useInView } from '@/hooks/useInView'

const outline = indiaOutline.map(([lon, lat], i) => { const [x, y] = project(lon, lat); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}` }).join(' ') + ' Z'
const [hx, hy] = project(hub.lon, hub.lat)
/** Label side per city so nothing overlaps: l = left of the dot, r = right. */
const side: Record<string, 'l' | 'r'> = { Pune: 'r', Nagpur: 'r', Mumbai: 'l' }
const all = corridors.flatMap((c) => c.cities.map((city) => ({ ...city, region: c.region })))

/** Curved lane from the hub to a city; the bend always lifts away from the line so lanes fan out. */
function lane(x: number, y: number) {
  const mx = (hx + x) / 2, my = (hy + y) / 2
  const dx = x - hx, dy = y - hy
  const k = 0.22
  return `M${hx} ${hy} Q${mx - dy * k} ${my + dx * k} ${x} ${y}`
}

function LaneMap({ active, onPick }: { active: string; onPick: (n: string) => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2)
  return (
    <div ref={ref} data-in={inView} className="group/map relative">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="mx-auto w-full max-w-[44rem] [mask-image:radial-gradient(ellipse_70%_72%_at_55%_50%,#000_62%,transparent_100%)]" role="img" aria-label={`Freight lanes from Lucknow to ${all.map((c) => c.name).join(', ')}`}>
        <defs>
          <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="rgb(255 255 255 / 0.1)" /></pattern>
          <clipPath id="india"><path d={outline} /></clipPath>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="rgb(32 163 141 / 0.22)" /><stop offset="1" stopColor="rgb(255 255 255 / 0.03)" /></linearGradient>
        </defs>
        <path d={outline} fill="url(#land)" />
        <rect width={MAP_W} height={MAP_H} fill="url(#grid)" clipPath="url(#india)" />
        <path d={outline} fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="1.25" strokeLinejoin="round" />

        {all.map((c, i) => {
          const [x, y] = project(c.lon, c.lat)
          const on = c.name === active
          return (
            <g key={c.name} className="opacity-0 transition-opacity duration-700 ease-brand group-data-[in=true]/map:opacity-100" style={{ transitionDelay: `${200 + i * 90}ms` }}>
              <path d={lane(x, y)} fill="none" stroke={on ? '#7fd3c3' : 'rgb(127 211 195 / 0.35)'} strokeWidth={on ? 3 : 1.6} strokeDasharray="5 9" className="motion-safe:animate-[dash_1.4s_linear_infinite]" />
              <g className="cursor-pointer" tabIndex={0} role="button" aria-label={`Show lane to ${c.name}`} aria-pressed={on} onClick={() => onPick(c.name)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(c.name) } }}>
                <circle cx={x} cy={y} r="18" fill="transparent" />
                <circle cx={x} cy={y} r={on ? 8 : 5.5} fill={on ? '#7fd3c3' : '#0b3d36'} stroke="#7fd3c3" strokeWidth="2" className="transition-all duration-300" />
                <text x={x + (side[c.name] === 'r' ? 14 : -14)} y={y + 4} textAnchor={side[c.name] === 'r' ? 'start' : 'end'} fontSize="21" fontWeight={on ? 700 : 500} fill={on ? '#fff' : 'rgb(255 255 255 / 0.7)'} className="select-none">{c.name}</text>
              </g>
            </g>
          )
        })}

        <g>
          <circle cx={hx} cy={hy} r="16" fill="#7fd3c3" opacity="0.55" className="origin-center motion-safe:animate-[ping-ring_2.4s_ease-out_infinite] [transform-box:fill-box]" />
          <circle cx={hx} cy={hy} r="10" fill="#7fd3c3" stroke="#fff" strokeWidth="3" />
          <text x={hx + 20} y={hy - 16} textAnchor="start" fontSize="23" fontWeight="700" fill="#fff">Lucknow hub</text>
        </g>
      </svg>
      <p className="mt-1 text-center text-xs text-white/45">Simplified map, not to scale. Tap a city to see its lane.</p>
    </div>
  )
}

export function Network() {
  const [active, setActive] = useState(all[0].name)
  const city = all.find((c) => c.name === active)!
  const km = straightKm(hub, city)

  return (
    <Section id="network" tone="dark" labelledBy="network-title" className="relative isolate overflow-hidden bg-linear-to-b from-night to-[#0a1213]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[42rem] rounded-full bg-brand/15 blur-[120px]" />
      <div className="grid items-center gap-[clamp(2rem,6vw,5rem)] lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-brand-300"><Radar size={16} aria-hidden="true" /> Hub in Lucknow, lanes across India</p>
          <h2 id="network-title" className="mt-5">Our Network</h2>
          <p className="mt-5 max-w-[46ch] text-lg text-white/75">{coverage} Pick a city to see the lane.</p>

          <div className="mt-8 grid gap-5">
            {corridors.map((c) => (
              <div key={c.region}>
                <h3 className="mb-2.5 text-sm font-semibold text-white/60">{c.region}</h3>
                <ul className="flex flex-wrap gap-2">
                  {c.cities.map((ct) => (
                    <li key={ct.name}>
                      <button type="button" aria-pressed={ct.name === active} onClick={() => setActive(ct.name)} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.92rem] font-semibold text-white/80 transition duration-200 hover:border-brand-300 hover:text-white aria-pressed:border-transparent aria-pressed:bg-brand aria-pressed:text-white aria-pressed:shadow-[0_8px_22px_-8px_rgb(32_163_141/0.9)]">
                        {ct.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div key={active} className="mt-8 flex animate-swap items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur" aria-live="polite">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/20 text-brand-300"><Route size={22} aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold text-white">Lucknow to {city.name}</p>
              <p className="text-[0.92rem] text-white/65">About {km} km in a straight line, {city.region}. Road distance and transit time are confirmed on your quote.</p>
            </div>
          </div>

          <div className="mt-8"><Button href="#booking" icon={<ArrowRight size={18} />}>Check your route</Button></div>
        </Reveal>
        <LaneMap active={active} onPick={setActive} />
      </div>
    </Section>
  )
}
