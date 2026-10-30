import {
  BadgeCheck, Boxes, Clock3, Container, MapPinned, PackageCheck, Route, ShieldCheck,
  Timer, Truck, Warehouse, ClipboardList, Headset, LocateFixed,
} from 'lucide-react'
import type { Faq, Feature, NavItem, ProcessStep, Service, Vehicle } from '@/types'

/* ------------------------------------------------------------------
 * EDIT ME — placeholder company details. Replace before going live.
 * ------------------------------------------------------------------ */
export const company = {
  name: 'Shankh Logistics',
  tagline: 'Freight that arrives when you said it would.',
  phone: '+91 98765 xxxxx',
  phoneHref: 'tel:+919876xxxxx',
  whatsapp: '91xxxxxxx', // country code + number, no "+" or spaces
  email: 'booking@shankhlogistics.in',
  address: '1/8,Sector-1 Gomati Nagar Extension Lucknow -226022(UP).India',
  hours: 'Mon–Sat, 8:00 am – 8:00 pm',
  /** EDIT ME: paste real profile URLs; empty ones are hidden in the footer. */
  social: { linkedin: '', facebook: '', instagram: '' },
  year: new Date().getFullYear(),
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Our Network', href: '#network' },
  { label: 'Fleet', href: '#fleet' },
  { label: 'Contact', href: '#contact' },
]

export const services: Service[] = [
  {
    title: 'Full truck load',
    description: 'A dedicated vehicle for your cargo alone, direct from pickup to drop with no transshipment.',
    icon: Truck,
    points: ['Mini trucks to 32 ft trailers', 'Direct point-to-point'],
  },
  {
    title: 'Part load',
    description: 'Ship smaller consignments on scheduled routes and pay only for the space you use.',
    icon: Boxes,
    points: ['Scheduled weekly departures', 'Cost-shared transport'],
  },
  {
    title: 'Warehousing',
    description: 'Secure storage, inventory handling and dispatch from one team and one invoice.',
    icon: Warehouse,
    points: ['Racked, covered storage', 'Pick, pack and dispatch'],
  },
  {
    title: 'Express delivery',
    description: 'Time-critical consignments moved on priority vehicles with live trip updates.',
    icon: Timer,
    points: ['Priority dispatch', 'Dedicated trip manager'],
  },
  {
    title: 'Heavy & ODC cargo',
    description: 'Machinery, steel and over-dimensional consignments on flatbed and low-bed trailers.',
    icon: Container,
    points: ['Flatbed and low-bed trailers', 'Route and permit planning'],
  },
  {
    title: 'Last-mile delivery',
    description: 'City-level distribution to dealers, retail points and customers with proof of delivery.',
    icon: MapPinned,
    points: ['Multi-drop routes', 'Signed proof of delivery'],
  },
]

export const vehicles: Vehicle[] = [
  { name: 'Mini truck', capacity: 'Up to 1 tonne', bestFor: 'City deliveries, small business loads' },
  { name: '14–17 ft truck', capacity: '3 to 5 tonnes', bestFor: 'Inter-city loads, FMCG, furniture' },
  { name: '19–24 ft truck', capacity: '7 to 10 tonnes', bestFor: 'Bulk consignments, industrial goods' },
  { name: '32 ft multi-axle', capacity: '15 to 18 tonnes', bestFor: 'Long-haul, high-volume freight' },
  { name: 'Flatbed / trailer', capacity: '20+ tonnes', bestFor: 'Machinery, steel, ODC cargo' },
]

export const steps: ProcessStep[] = [
  { title: 'Share your load', description: 'Tell us pickup, drop, cargo and date. Takes about two minutes.', icon: ClipboardList },
  { title: 'Get a confirmed quote', description: 'Our team calls back with a clear rate and vehicle plan. No hidden charges.', icon: Headset },
  { title: 'Pickup and transit', description: 'A verified driver collects your cargo and you follow the trip on call or WhatsApp.', icon: Route },
  { title: 'Delivery with proof', description: 'Cargo is handed over and you receive signed proof of delivery.', icon: PackageCheck },
]

export const features: Feature[] = [
  { title: 'GPS-tracked vehicles', description: 'Know where your consignment is at every stage of the trip.', icon: LocateFixed },
  { title: 'Verified drivers', description: 'Background-checked, experienced drivers on every route we run.', icon: BadgeCheck },
  { title: 'Cargo safety', description: 'Careful loading, secured lashing and transit insurance support.', icon: ShieldCheck },
  { title: 'Reliable timelines', description: 'Realistic delivery windows, and a real person to call if plans change.', icon: Clock3 },
]

export const industries = [
  'FMCG & retail', 'Automotive parts', 'Construction material', 'Pharma & healthcare',
  'Agriculture', 'E-commerce', 'Machinery & steel', 'Household shifting',
]

export const cargoTypes = [
  'General goods', 'FMCG / retail', 'Industrial / machinery', 'Construction material',
  'Agriculture produce', 'Household shifting', 'Other',
]

export const faqs: Faq[] = [
  {
    question: 'How quickly will I get a quote after booking?',
    answer: 'Our team calls back within working hours, usually within 30 minutes, with a confirmed rate and a vehicle plan.',
  },
  {
    question: 'Which routes and cities do you cover?',
    answer: 'We run daily and weekly services from Uttar Pradesh to major cities across North, Central and West India. Share your route and we will confirm coverage right away.',
  },
  {
    question: 'Can I track my shipment?',
    answer: 'Yes. Vehicles are GPS-enabled and our trip manager shares live updates by phone or WhatsApp until delivery.',
  },
  {
    question: 'Is my cargo insured in transit?',
    answer: 'We help arrange transit insurance for your consignment. Tell us the cargo value when you book and we will advise the right cover.',
  },
  {
    question: 'Do you handle loading and unloading?',
    answer: 'Yes. Loading, unloading and basic packing support can be added to any booking on request.',
  },
]
