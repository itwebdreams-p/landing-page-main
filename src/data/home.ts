import { Boxes, Gauge, Headset, Route, Truck, Truck as TruckIcon, Warehouse, Clock3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { images } from '@/data/images'

/* Only services Shankh Logistics actually offers (see data/content.ts). */
export interface ServiceCard { title: string; description: string; icon: LucideIcon; image: string; alt: string }

export const serviceCards: ServiceCard[] = [
  {
    title: 'Road Transportation',
    description: 'Scheduled and on-demand road freight from Uttar Pradesh to cities across North, Central and West India.',
    icon: Route, image: images.hero, alt: 'Truck on an Indian highway',
  },
  {
    title: 'Full Truck Load (FTL)',
    description: 'A dedicated vehicle for your cargo alone, from mini trucks to 32 ft trailers, direct from pickup to drop.',
    icon: Truck, image: images.fleet, alt: 'Flatbed truck carrying heavy cargo',
  },
  {
    title: 'Warehousing',
    description: 'Covered, racked storage with inventory handling and dispatch from the team that moves your freight.',
    icon: Warehouse, image: images.warehouse, alt: 'Workers handling boxes on warehouse shelves',
  },
  {
    title: 'Freight & Distribution',
    description: 'Part-load consignments and multi-drop distribution to dealers and retail points, with signed proof of delivery.',
    icon: Boxes, image: images.warehouseWide, alt: 'Wide view of a distribution warehouse',
  },
]

export const advantages: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Reliability', description: 'Realistic delivery windows, and a real person to call if plans change.', icon: Clock3 },
  { title: 'Fleet operations', description: 'GPS-tracked vehicles and background-checked drivers on every route we run.', icon: TruckIcon },
  { title: 'Transportation coordination', description: 'A trip manager shares updates by phone or WhatsApp until delivery.', icon: Headset },
  { title: 'Operational efficiency', description: 'Transport and storage from one team on one invoice, so nothing falls between two vendors.', icon: Gauge },
]

export const infrastructure = [
  'Covered, racked storage with controlled access',
  'Inbound checks and stock records you can ask for any day',
  'Pick, pack and dispatch on your schedule',
  'Loading, unloading and basic packing support on request',
]
