import { ArrowUp, Clock3, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { company, navItems } from '@/data/content'
import { serviceCards } from '@/data/home'

const heading = 'mb-[1.1rem] text-[0.95rem] text-white'
const link = 'text-[0.95rem] transition-colors duration-200 ease-brand hover:text-white'

const socials = [
  { label: 'WhatsApp', href: `https://wa.me/${company.whatsapp}`, icon: MessageCircle },
  { label: 'LinkedIn', href: company.social.linkedin, icon: Linkedin },
  { label: 'Facebook', href: company.social.facebook, icon: Facebook },
  { label: 'Instagram', href: company.social.instagram, icon: Instagram },
].filter((s) => s.href)

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-night-2 pt-[clamp(3.5rem,7vw,5.5rem)] text-white/65">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand to-transparent" />
      <Container>
        <div className="grid grid-cols-1 gap-[clamp(2rem,4vw,3.5rem)] pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
          <div>
            <Logo variant="light" height={52} />
            <p className="mt-5 max-w-[34ch] text-[0.95rem]">
              {company.tagline} Dependable road freight, warehousing and distribution for businesses across India.
            </p>
            <ul className="mt-6 flex gap-3" aria-label="Social links">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-md border border-white/15 text-white/80 transition-colors duration-200 hover:border-white/40 hover:text-white">
                    <Icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer quick links">
            <h3 className={heading}>Company</h3>
            <ul className="space-y-2.5">
              {navItems.map((item) => <li key={item.href}><a className={link} href={item.href}>{item.label}</a></li>)}
              <li><a className={link} href="#faq">FAQ</a></li>
              
            </ul>
          </nav>

          <nav aria-label="Footer services">
            <h3 className={heading}>Services</h3>
            <ul className="space-y-2.5">
              {serviceCards.map((s) => <li key={s.title}><a className={link} href="#services">{s.title}</a></li>)}
            </ul>
          </nav>

          <div>
            <h3 className={heading}>Contact</h3>
            <ul className="space-y-2.5 text-[0.95rem] [&_svg]:mt-1 [&_svg]:shrink-0 [&_svg]:text-brand-300 [&>li]:flex [&>li]:items-start [&>li]:gap-2.5">
              <li><Phone size={18} aria-hidden="true" /><a className={link} href={company.phoneHref}>{company.phone}</a></li>
              <li><Mail size={18} aria-hidden="true" /><a className={link} href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><MapPin size={18} aria-hidden="true" /><span>{company.address}</span></li>
              <li><Clock3 size={18} aria-hidden="true" /><span>{company.hours}</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-sm">
          <p>© {company.year} {company.name}. All rights reserved.</p>
          <a href="#top" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-semibold text-white/80 transition-colors duration-200 hover:border-brand hover:text-white"><ArrowUp size={16} aria-hidden="true" /> Back to top</a>
        </div>
      </Container>
    </footer>
  )
}
