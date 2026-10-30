import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-linear-to-br from-[#0f5247] via-brand-900 to-night py-[clamp(4.5rem,9vw,7rem)] text-white">
      <div aria-hidden="true" className="absolute -top-32 -right-24 -z-10 size-[30rem] rounded-full bg-gold/20 blur-[110px]" />
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <h2 id="cta-title" className="max-w-[18ch] text-white">Let’s Move Your Business Forward.</h2>
            <p className="mt-4 max-w-[34rem] text-lg text-white/70">Tell us the route and we will come back with a clear rate today.</p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Button variant="gold" href="#booking" size="lg" icon={<ArrowRight size={18} />}>Book Your Shipment</Button>
            <Button href="#contact" size="lg" variant="onDark">Contact Our Team</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
