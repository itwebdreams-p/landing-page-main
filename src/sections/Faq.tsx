import { Accordion } from '@/components/ui/Accordion'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { faqs } from '@/data/content'

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid items-start gap-[clamp(1.5rem,5vw,4.5rem)] lg:grid-cols-[0.8fr_1.4fr]">
        <SectionHeading
          id="faq-title"
          title="Questions, answered"
          description="Can't find what you need? Call us and a person will pick up."
          align="stack"
          flush
        />
        <Accordion items={faqs} />
      </div>
    </Section>
  )
}