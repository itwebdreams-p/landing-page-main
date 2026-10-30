import { WhatsAppFab } from '@/components/ui/WhatsAppFab'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Header } from '@/components/layout/Header'
import { AuthModal } from '@/components/auth/AuthModal'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/sections/Hero'
import { Booking } from '@/sections/Booking'
import { Services } from '@/sections/Services'
import { WhyUs } from '@/sections/WhyUs'
import { Network } from '@/sections/Network'
import { Fleet } from '@/sections/Fleet'
import { CtaBand } from '@/sections/CtaBand'
import { About } from '@/sections/About'
import { Process } from '@/sections/Process'
import { Faq } from '@/sections/Faq'
import { Contact } from '@/sections/Contact'

export default function App() {
  return (
    <>
      <a
        className="absolute top-[-4rem] left-4 z-[200] rounded-sm bg-ink px-4 py-2.5 text-white transition-[top] duration-200 ease-brand focus:top-4"
        href="#main"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero />
        <Booking />
        <About />
        <Services />
        <WhyUs />
        <Network />
        <Fleet />
        <Process />
        <Faq />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
      <AuthModal />
      <WhatsAppFab />
    </>
  )
}
