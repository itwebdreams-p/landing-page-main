/**
 * Real-world photography (Unsplash & Pexels, both free for commercial use).
 * For production, download these into /public/images and point the paths here —
 * or swap in the client's own fleet and warehouse photos.
 */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=${w}`
const pexels = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

export const images = {
  hero: unsplash('1682033239487-30f076c82232', 1920),
  fleet: unsplash('1682033240184-262fdb8234cb', 1400),
  warehouse: pexels(4483862, 1400),
  warehouseWide: pexels(4483610, 1920),
  warehouseAisle: pexels(8377802, 1400),
}

/**
 * Hero background. By default a slider cycles through `heroSlides`.
 * To use video instead, put an MP4 in /public (e.g. /hero.mp4, under about 6 MB, no sound needed) and set heroVideo to '/hero.mp4'.
 */
export const heroVideo = ''
export const heroSlides = [
  { src: images.hero, alt: 'Truck on an Indian highway', title: 'Road transportation' },
  { src: images.fleet, alt: 'Flatbed truck carrying heavy cargo', title: 'Full truck load' },
  { src: images.warehouse, alt: 'Workers handling boxes on warehouse shelves', title: 'Warehousing' },
  { src: images.warehouseWide, alt: 'Wide view of a distribution warehouse', title: 'Freight and distribution' },
]
