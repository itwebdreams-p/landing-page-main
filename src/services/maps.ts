let loading: Promise<typeof google> | null = null

/** Loads Google Maps once, however many pickers are on the page. */
export function loadGoogleMaps(): Promise<typeof google> {
  if (loading) return loading
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  if (!key) return Promise.reject(new Error('The Google Maps key is not set.'))

  loading = new Promise((resolve, reject) => {
    const callback = '__shankhMapsReady'
    const globals = window as unknown as Record<string, unknown>
    globals[callback] = () => resolve(window.google)
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&loading=async&callback=${callback}`
    script.async = true
    script.onerror = () => {
      loading = null
      reject(new Error('Google Maps could not be loaded.'))
    }
    document.head.appendChild(script)
  })
  return loading
}
