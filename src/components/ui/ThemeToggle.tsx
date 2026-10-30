import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

/** Sun / moon switch. The icon turns as the theme changes. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-current/20 transition-colors duration-200 hover:border-brand hover:text-brand ${className}`}
    >
      <Sun size={18} aria-hidden="true" className={`absolute transition duration-500 ease-brand ${dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
      <Moon size={18} aria-hidden="true" className={`absolute transition duration-500 ease-brand ${dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
    </button>
  )
}
