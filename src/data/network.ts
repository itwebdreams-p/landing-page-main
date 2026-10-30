/**
 * Our Network: ONLY verified locations belong in `locations`.
 * To add a hub later, push { name, role, lon, lat } and it appears on the map automatically.
 */
export const locations = [
  { name: 'Lucknow', role: 'Head office', lon: 80.95, lat: 26.85 },
]

/** Coverage as stated by the company (see FAQ in content.ts). */
export const coverage = 'Daily and weekly services from Uttar Pradesh to major cities across North, Central and West India.'

/** Simplified, illustrative outline of India as [longitude, latitude]. */
export const indiaOutline: [number, number][] = [
  [74.3, 36.9], [77.0, 35.7], [79.0, 34.6], [78.9, 32.6], [79.3, 31.0], [80.2, 30.2], [81.0, 30.2], [80.1, 28.8],
  [82.0, 27.9], [84.0, 27.4], [86.0, 26.6], [88.1, 26.4], [88.1, 27.9], [88.9, 27.3], [89.8, 26.8], [92.0, 26.9],
  [92.1, 27.8], [94.5, 29.3], [96.2, 29.0], [97.3, 28.2], [96.1, 27.2], [95.2, 26.0], [94.6, 24.0], [93.3, 22.9],
  [92.4, 24.1], [92.0, 25.1], [90.0, 25.2], [89.7, 25.3], [88.4, 25.2], [88.0, 24.6], [88.6, 23.3], [89.0, 21.9],
  [87.0, 21.5], [86.9, 20.7], [85.0, 19.3], [84.0, 18.3], [82.3, 16.7], [80.3, 15.4], [80.2, 13.5], [79.9, 11.9],
  [79.8, 10.3], [78.9, 9.3], [77.5, 8.1], [76.5, 9.0], [75.8, 11.3], [74.8, 13.0], [74.0, 15.2], [73.3, 17.5],
  [72.8, 19.2], [72.8, 21.0], [72.5, 21.4], [71.0, 20.8], [70.0, 21.0], [69.0, 22.2], [68.4, 23.6], [70.5, 24.7],
  [70.0, 26.0], [70.3, 27.8], [72.8, 29.2], [74.4, 30.9], [74.6, 31.6], [74.8, 32.5], [74.0, 33.3], [73.6, 34.5],
]

/** Map is cropped to the lanes (lon 68 to 90, lat 16.5 to 33.5) so labels have room. */
export const MAP_W = 850
export const MAP_H = 650
export const project = (lon: number, lat: number): [number, number] => [(lon - 68) * 38, (33.5 - lat) * 38]

/**
 * Lanes shown on the map, all running out of the Lucknow hub.
 * EDIT ME: cities are examples of "major cities across North, Central and West India" (see `coverage`).
 * Keep only the ones the company really serves.
 */
export const hub = locations[0]
export const corridors = [
  { region: 'North India', cities: [
    { name: 'Delhi NCR', lon: 77.2, lat: 28.6 }, { name: 'Chandigarh', lon: 76.78, lat: 30.73 }, { name: 'Jaipur', lon: 75.8, lat: 26.9 },
  ] },
  { region: 'Central India', cities: [
    { name: 'Bhopal', lon: 77.4, lat: 23.26 }, { name: 'Indore', lon: 75.86, lat: 22.72 }, { name: 'Nagpur', lon: 79.09, lat: 21.15 },
  ] },
  { region: 'West India', cities: [
    { name: 'Ahmedabad', lon: 72.57, lat: 23.03 }, { name: 'Pune', lon: 73.86, lat: 18.52 }, { name: 'Mumbai', lon: 72.88, lat: 19.08 },
  ] },
]

/** Straight-line distance in km (great circle). Road distance is longer; the team confirms it on the quote. */
export function straightKm(a: { lon: number; lat: number }, b: { lon: number; lat: number }) {
  const r = Math.PI / 180
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2
  return Math.round((12742 * Math.asin(Math.sqrt(h))) / 10) * 10
}
