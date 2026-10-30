interface LogoProps { variant?: 'dark' | 'light'; height?: number; className?: string }

/** Official Shankh Logistics lockup, exported as vector from the supplied logo files. */
export function Logo({ variant = 'dark', height = 44, className }: LogoProps) {
  const src = variant === 'light' ? '/logo-horizontal-light.svg' : '/logo-horizontal.svg'
  return <img src={src} alt="Shankh Logistics" height={height} style={{ height, width: 'auto' }} className={className} />
}
