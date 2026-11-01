import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Loader2, MapPin, Search } from 'lucide-react'
import { TextField } from '@/components/ui/Field'
import { loadGoogleMaps } from '@/services/maps'

export interface PickedLocation {
  address: string
  city: string
  lat: number | null
  lng: number | null
}

interface Suggestion {
  id: string
  title: string
  subtitle: string
  prediction: google.maps.places.PlacePrediction
}

const INDIA = { lat: 22.9734, lng: 78.6569 }
const round6 = (n: number) => Math.round(n * 1e6) / 1e6

/** Places and Geocoding name the parts of an address differently; this reads either. */
function cityOf(components: { types: string[]; longText?: string | null; long_name?: string }[]) {
  for (const type of ['locality', 'administrative_area_level_3', 'administrative_area_level_2']) {
    const found = components.find((c) => c.types.includes(type))
    if (found) return found.longText ?? found.long_name ?? ''
  }
  return ''
}

function useDebounced(value: string, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(timer)
  }, [value, ms])
  return debounced
}

/**
 * Pickup or delivery place: search it or click the map, then drag the pin to
 * the exact spot, and the address follows. A typed address moves the pin too,
 * until the pin is placed by hand: after that, typing a landmark must not take
 * it away from the exact spot. Without Google Maps the address can still be typed.
 */
export function LocationPicker({
  kind, value, onChange, error,
}: {
  kind: 'pickup' | 'drop'
  value: PickedLocation
  onChange: (next: PickedLocation) => void
  error?: string
}) {
  const word = kind === 'pickup' ? 'pickup' : 'delivery'
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query, 300)
  const [typed, setTyped] = useState('')
  const debouncedTyped = useDebounced(typed, 700)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)

  const box = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const sessionRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const pinByHand = useRef(false)
  const geocodeRun = useRef(0)
  // The latest value/onChange, for map listeners that are attached once.
  const valueRef = useRef(value)
  valueRef.current = value
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  /** The pin was put somewhere by hand: keep the point, and read the address there. */
  const pointMoved = useCallback(async (lat: number, lng: number) => {
    pinByHand.current = true
    const point = { lat: round6(lat), lng: round6(lng) }
    onChangeRef.current({ ...valueRef.current, ...point })
    try {
      const { results } = await new google.maps.Geocoder().geocode({ location: point })
      const best = results[0]
      if (!best) return
      onChangeRef.current({ ...valueRef.current, ...point, address: best.formatted_address, city: cityOf(best.address_components) || valueRef.current.city })
    } catch {
      // The point is kept; the address can be typed.
    }
  }, [])

  const placeMarker = useCallback((lat: number, lng: number) => {
    const map = mapRef.current
    if (!map) return
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        map,
        draggable: true,
        label: { text: kind === 'pickup' ? 'P' : 'D', color: '#ffffff', fontWeight: '700' },
        title: 'Drag to the exact spot',
      })
      markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) void pointMoved(event.latLng.lat(), event.latLng.lng())
      })
    }
    markerRef.current.setPosition({ lat, lng })
    map.panTo({ lat, lng })
    if ((map.getZoom() ?? 0) < 15) map.setZoom(16)
  }, [kind, pointMoved])

  /** Finds the place an address names and moves the pin there. The words typed stay as they are. */
  const findAddress = useCallback(async (text: string) => {
    const run = ++geocodeRun.current
    try {
      const { results } = await new google.maps.Geocoder().geocode({ address: text, region: 'in', componentRestrictions: { country: 'IN' } })
      const best = results[0]
      if (!best || run !== geocodeRun.current || pinByHand.current) return
      const lat = round6(best.geometry.location.lat())
      const lng = round6(best.geometry.location.lng())
      const current = valueRef.current
      onChangeRef.current({ ...current, lat, lng, city: current.city || cityOf(best.address_components) })
      placeMarker(lat, lng)
    } catch {
      // An address Google cannot find leaves the pin alone.
    }
  }, [placeMarker])

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !box.current) return
        const map = new google.maps.Map(box.current, {
          center: INDIA,
          zoom: 5,
          // The map sits inside a long form: plain scrolling must scroll the page.
          gestureHandling: 'cooperative',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })
        mapRef.current = map
        map.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return
          placeMarker(event.latLng.lat(), event.latLng.lng())
          void pointMoved(event.latLng.lat(), event.latLng.lng())
        })
        const { lat, lng } = valueRef.current
        if (lat !== null && lng !== null) placeMarker(lat, lng)
        setMapReady(true)
      })
      .catch(() => { if (!cancelled) setMapFailed(true) })
    return () => { cancelled = true }
  }, [placeMarker, pointMoved])

  useEffect(() => {
    if (debouncedTyped.trim().length >= 4 && mapReady && !pinByHand.current) void findAddress(debouncedTyped)
  }, [debouncedTyped, findAddress, mapReady])

  useEffect(() => {
    const input = debouncedQuery.trim()
    if (input.length < 3 || !mapReady) {
      setSuggestions([])
      return
    }
    let cancelled = false
    setSearching(true)
    ;(async () => {
      try {
        const places = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary
        sessionRef.current ??= new places.AutocompleteSessionToken()
        const { suggestions: found } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionRef.current,
          includedRegionCodes: ['in'],
        })
        if (cancelled) return
        setSuggestions(found.flatMap((s) => (s.placePrediction ? [{
          id: s.placePrediction.placeId,
          title: s.placePrediction.mainText?.text ?? s.placePrediction.text.text,
          subtitle: s.placePrediction.secondaryText?.text ?? '',
          prediction: s.placePrediction,
        }] : [])))
      } catch {
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setSearching(false)
      }
    })()
    return () => { cancelled = true }
  }, [debouncedQuery, mapReady])

  const pickSuggestion = async (suggestion: Suggestion) => {
    setOpen(false)
    setQuery(suggestion.title)
    pinByHand.current = false
    try {
      const place = suggestion.prediction.toPlace()
      await place.fetchFields({ fields: ['location', 'formattedAddress', 'addressComponents'] })
      sessionRef.current = null // a session ends once a place is fetched
      if (!place.location) return
      const lat = round6(place.location.lat())
      const lng = round6(place.location.lng())
      onChange({ address: place.formattedAddress ?? `${suggestion.title}, ${suggestion.subtitle}`, city: cityOf(place.addressComponents ?? []), lat, lng })
      placeMarker(lat, lng)
    } catch {
      // Another result can be picked, or the map clicked.
    }
  }

  const hasPoint = value.lat !== null && value.lng !== null

  return (
    <div className="grid min-w-0 gap-3">
      <p className="text-sm font-semibold text-ink">{kind === 'pickup' ? 'Pickup location' : 'Delivery location'}</p>

      {!mapFailed && (
        <div className="relative">
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-[0.95rem] text-muted" />
          {searching && <Loader2 size={16} aria-hidden="true" className="absolute right-3.5 top-[0.95rem] animate-spin text-muted" />}
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              // Enter here picks a place; it must not send the whole booking form.
              e.preventDefault()
              if (suggestions[0]) void pickSuggestion(suggestions[0])
            }}
            placeholder={`Search the ${word} address, area or landmark`}
            aria-label={`Search the ${word} location`}
            autoComplete="off"
            className="w-full rounded-lg border-[1.5px] border-line bg-surface py-[0.78rem] pl-10 pr-10 text-base text-ink"
          />
          {open && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-surface py-1 shadow-lg">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => void pickSuggestion(s)}
                    className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-mist"
                  >
                    <MapPin size={14} aria-hidden="true" className="mt-1 shrink-0 text-muted" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink">{s.title}</span>
                      {s.subtitle && <span className="block truncate text-xs text-muted">{s.subtitle}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {mapFailed ? (
        <p className="rounded-lg bg-mist px-3 py-2 text-sm text-muted">The map could not be loaded. Type the address and city below.</p>
      ) : (
        <div ref={box} className="h-56 w-full overflow-hidden rounded-lg border-[1.5px] border-line bg-mist" />
      )}

      {hasPoint ? (
        <p className="flex items-center gap-1.5 text-[0.8125rem] text-brand">
          <CheckCircle2 size={14} aria-hidden="true" /> Location set. Drag the pin if the exact spot is somewhere else.
        </p>
      ) : !mapFailed && (
        <p className="flex items-center gap-1.5 text-[0.8125rem] text-muted">
          <MapPin size={14} aria-hidden="true" /> Search above and pick a result, or click the map.
        </p>
      )}

      <TextField
        label="Address"
        placeholder="Filled from the map. Add a landmark or gate number."
        value={value.address}
        onChange={(e) => {
          onChange({ ...value, address: e.target.value })
          setTyped([e.target.value, value.city].filter(Boolean).join(', '))
        }}
      />
      <TextField
        label="City"
        placeholder={kind === 'pickup' ? 'e.g. Lucknow' : 'e.g. Delhi'}
        error={error}
        value={value.city}
        onChange={(e) => {
          onChange({ ...value, city: e.target.value })
          setTyped([value.address, e.target.value].filter(Boolean).join(', '))
        }}
      />
    </div>
  )
}
