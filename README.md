# Shankh Logistics — Landing Page

React + TypeScript + Vite. No UI framework; plain CSS with design tokens.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Where to edit
- `src/data/content.ts` — phone, email, address, services, vehicles, FAQs (placeholder details are marked)
- `src/data/images.ts` — all photos in one place (swap for client's own fleet/warehouse photos)
- `src/services/booking.ts` — connect your real booking API here (WhatsApp confirm link already works)
- `src/styles/tokens.css` — brand colours, fonts, radii

## Structure
- `components/ui` — reusable: Button, Section, SectionHeading, Card, IconBadge, Photo, Field (Text/Select/TextArea), Accordion, Logo
- `components/layout` — Header (with Book now), Footer
- `components` — QuickBook, BookingForm
- `sections` — Hero, Services, Warehousing, Fleet, Process, WhyUs, Booking, Faq, CtaBand
