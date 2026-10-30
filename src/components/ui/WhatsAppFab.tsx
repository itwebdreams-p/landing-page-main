import { MessageCircle } from 'lucide-react'
import { useScrolled } from '@/hooks/useScrolled'
import { company } from '@/data/content'

/** Round WhatsApp button, always within thumb reach. */
export function WhatsAppFab() {
  // Appears once the hero is behind you, so it never crowds the hero controls.
  const show = useScrolled(600)
  return (
    <a
      href={`https://wa.me/${company.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={show ? 0 : -1}
      aria-label="Chat with us on WhatsApp"
      className={`group fixed right-5 bottom-5 z-[120] flex items-center gap-2 rounded-full bg-linear-to-b from-[#2cbba4] to-[#17806e] p-3.5 text-white shadow-[0_14px_30px_-10px_rgb(32_163_141/0.9)] transition duration-300 ease-brand hover:-translate-y-1 sm:right-7 sm:bottom-7 ${show ? '' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <MessageCircle size={24} aria-hidden="true" />
      <span className="max-w-0 overflow-hidden text-[0.95rem] font-semibold whitespace-nowrap transition-all duration-300 ease-brand group-hover:max-w-40 group-hover:pr-2 group-focus-visible:max-w-40 group-focus-visible:pr-2">Chat on WhatsApp</span>
    </a>
  )
}
