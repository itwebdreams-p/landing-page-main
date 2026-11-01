import type { BookingPayload } from '@/types'
import { company } from '@/data/content'

export interface BookingResult { reference: string; whatsappUrl: string }
export interface BookingOptions { cargoTypes: string[]; vehicles: { value: string; label: string }[] }

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

/** The form's lists as Admin keeps them. Null when they cannot be read: the form then uses its own list. */
export async function loadBookingOptions(): Promise<BookingOptions | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/crm/public/booking-options/`)
    if (!response.ok) return null
    const { data } = await response.json()
    return { cargoTypes: data.cargo_types, vehicles: data.vehicle_types }
  } catch {
    return null
  }
}

/** Tells the person what to do next, because a lost enquiry is a lost customer. */
export class BookingError extends Error {}

/**
 * Sends the booking request to the ERP, where it appears as a new lead for the Admin.
 * The mobile app uses the same call: POST /api/v1/crm/public/leads/ with source "app".
 */
export async function submitBooking(payload: BookingPayload, website = ''): Promise<BookingResult> {
  const isBroker = payload.role === 'broker'

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1/crm/public/leads/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'website',
        party_type: payload.role,
        company_name: payload.companyName,
        contact_name: payload.name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        gst_number: payload.gst,
        pan_number: payload.pan,
        aadhaar: payload.aadhaar,
        pickup: payload.pickup,
        drop: payload.drop,
        pickup_address: payload.pickupAddress,
        pickup_lat: payload.pickupLat,
        pickup_lng: payload.pickupLng,
        drop_address: payload.dropAddress,
        drop_lat: payload.dropLat,
        drop_lng: payload.dropLng,
        cargo: payload.cargo,
        vehicle: payload.vehicle,
        weight: payload.weight,
        pickup_date: payload.date || null,
        notes: payload.notes,
        website,
      }),
    })
  } catch {
    throw new BookingError('We could not reach our server. Check your internet and try again, or call us.')
  }

  const body = await response.json().catch(() => null)
  if (response.status === 429) throw new BookingError('Too many requests from this connection. Please try again later, or call us.')
  if (!response.ok) {
    const errors = body?.errors && Object.values(body.errors).flat()
    throw new BookingError(errors?.[0] ? String(errors[0]) : body?.message ?? 'We could not send your request. Please try again, or call us.')
  }

  const reference: string = body.data.reference
  // PAN, Aadhaar and GST are deliberately NOT put in the WhatsApp text: they belong in your backend, not in a chat link.
  const message = [
    `Hello Shankh Logistics, I would like to book a shipment (Ref ${reference}).`,
    `Booking type: ${isBroker ? 'Broker' : 'Customer'}`,
    isBroker ? `Broker: ${payload.name}` : `Company: ${payload.companyName}`,
    `Contact: ${payload.phone}`,
    `Route: ${payload.pickup} to ${payload.drop}`,
    `Cargo: ${payload.cargo}${payload.weight ? `, ${payload.weight}` : ''}`,
    `Vehicle: ${payload.vehicle || 'Not sure'}`,
    `Pickup date: ${payload.date}`,
  ].join('\n')

  return {
    reference,
    whatsappUrl: `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`,
  }
}
