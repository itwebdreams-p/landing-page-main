import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'

/** Shared look for every input, select and textarea. */
const control =
  'w-full rounded-lg border-[1.5px] border-line bg-surface px-[0.95rem] py-[0.78rem] text-base text-ink transition duration-200 ease-brand placeholder:text-[#8a9496] hover:border-[#bccac6] focus:border-brand focus:shadow-[0_0_0_4px_rgb(32_163_141/0.18)] focus:outline-none aria-invalid:border-[#c2412d]'

interface FieldShellProps { label: string; error?: string; hint?: string; children: (id: string, describedBy?: string) => ReactNode }

function FieldShell({ label, error, hint, children }: FieldShellProps) {
  const id = useId()
  const msgId = `${id}-msg`
  const describedBy = error || hint ? msgId : undefined
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink" htmlFor={id}>{label}</label>
      {children(id, describedBy)}
      {(error || hint) && (
        <p id={msgId} className={`text-[0.8125rem] ${error ? 'text-[#b23a28]' : 'text-muted'}`} role={error ? 'alert' : undefined}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

interface BaseProps { label: string; error?: string; hint?: string }

export function TextField({ label, error, hint, className = '', ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <input id={id} className={`${control} ${className}`.trim()} aria-invalid={!!error} aria-describedby={describedBy} {...props} />
      )}
    </FieldShell>
  )
}

export function SelectField({ label, error, hint, children, className = '', ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <div className="relative">
          <select
            id={id}
            className={`${control} cursor-pointer appearance-none pr-10 ${className}`.trim()}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          >
            {children}
          </select>
          <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted" />
        </div>
      )}
    </FieldShell>
  )
}

export function TextAreaField({ label, error, hint, className = '', ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <textarea
          id={id}
          rows={3}
          className={`${control} min-h-22 resize-y ${className}`.trim()}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
      )}
    </FieldShell>
  )
}

export function PasswordField({ label, error, hint, className = '', ...props }: BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [visible, setVisible] = useState(false)
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <div className="relative">
          <input
            id={id}
            className={`${control} pr-12 ${className}`.trim()}
            type={visible ? 'text' : 'password'}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />
          <button
            type="button"
            className="absolute top-1/2 right-1.5 grid size-[38px] -translate-y-1/2 place-items-center rounded-sm text-muted transition duration-200 ease-brand hover:bg-mist hover:text-ink"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      )}
    </FieldShell>
  )
}