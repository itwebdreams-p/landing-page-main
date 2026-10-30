import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'gold' | 'primary' | 'secondary' | 'outline' | 'onDark' | 'light'
type Size = 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  icon?: ReactNode
  children: ReactNode
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const base =
  'group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-[1.5px] border-transparent font-display font-semibold tracking-[-0.005em] transition duration-200 ease-brand disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  gold: 'bg-linear-to-b from-[#2cbba4] to-[#17806e] text-white shadow-[0_10px_24px_-10px_rgb(32_163_141/0.8),inset_0_1px_0_rgb(255_255_255/0.28)] enabled:hover:-translate-y-px enabled:hover:brightness-110',
  primary: 'bg-linear-to-b from-[#2cbba4] to-[#17806e] text-white shadow-[0_10px_24px_-10px_rgb(32_163_141/0.8),inset_0_1px_0_rgb(255_255_255/0.28)] enabled:hover:-translate-y-px enabled:hover:shadow-[0_14px_28px_-10px_rgb(32_163_141/0.9),inset_0_1px_0_rgb(255_255_255/0.28)]',
  secondary: 'bg-night text-white enabled:hover:bg-brand-700',
  outline: 'border-line bg-transparent text-ink enabled:hover:border-brand enabled:hover:text-brand-ink',
  onDark: 'border-white/30 bg-transparent text-white enabled:hover:border-white enabled:hover:bg-white/10',
  light: 'bg-white text-[#0e1516] enabled:hover:bg-brand-50',
}

const sizes: Record<Size, string> = {
  md: 'px-[1.35rem] py-[0.72rem] text-[0.95rem]',
  lg: 'px-[1.7rem] py-[0.95rem] text-base',
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', fullWidth, icon, children, className = '', ...rest } = props
  const classes = [base, variants[variant], sizes[size], fullWidth && 'w-full', className].filter(Boolean).join(' ')

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="inline-flex transition-transform duration-200 ease-brand group-hover:translate-x-[3px]" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  )

  if ('href' in rest && rest.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}