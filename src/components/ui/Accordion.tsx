import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem { question: string; answer: string }

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface px-6 shadow-sm">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div className="border-b border-line last:border-b-0" key={item.question}>
            <h3>
              <button
                className="flex w-full items-center justify-between gap-6 py-[1.35rem] text-left font-display text-[1.075rem] font-semibold text-ink hover:text-brand-ink"
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className={`shrink-0 text-brand transition-transform duration-300 ease-brand ${open ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-brand ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[60ch] pr-12 pb-6 text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}