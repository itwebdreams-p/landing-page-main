import type { LucideIcon } from 'lucide-react'

export interface NavItem { label: string; href: string }

export interface Service { title: string; description: string; icon: LucideIcon; points: string[] }

export interface Vehicle { name: string; capacity: string; bestFor: string }

export interface ProcessStep { title: string; description: string; icon: LucideIcon }

export interface Feature { title: string; description: string; icon: LucideIcon }

export interface Faq { question: string; answer: string }

export interface BookingDraft {
  pickup: string
  drop: string
  vehicle: string
}

export type BookingRole = 'customer' | 'broker'

/** One flat shape for both forms. Customer uses companyName/gst; broker uses name. */
export interface BookingPayload {
  role: BookingRole
  companyName: string
  name: string
  address: string
  gst: string
  pan: string
  aadhaar: string
  phone: string
  email: string
  pickup: string
  drop: string
  vehicle: string
  cargo: string
  date: string
  weight: string
  notes: string
}

export type AuthView = 'login' | 'register'

export interface AuthUser {
  id: string
  name: string
  phone: string
  email: string
  role?: BookingRole
}

export interface ContactPayload { name: string; phone: string; email: string; topic: string; message: string }