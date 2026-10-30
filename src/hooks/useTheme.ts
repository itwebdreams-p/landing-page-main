import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'shankh-theme'
const listeners = new Set<() => void>()

const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080d0e' : '#20A38D')
  try { localStorage.setItem(KEY, theme) } catch { /* private mode */ }
  listeners.forEach((l) => l())
}

/** Light/dark theme. The first value comes from the saved choice, else the device setting (see index.html). */
export function useTheme() {
  const theme = useSyncExternalStore((cb) => { listeners.add(cb); return () => { listeners.delete(cb) } }, read, () => 'light' as Theme)
  const toggle = useCallback(() => apply(read() === 'dark' ? 'light' : 'dark'), [])
  return { theme, toggle }
}
