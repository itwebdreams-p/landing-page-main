import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getSession, logout } from '@/services/auth'
import type { AuthUser, AuthView } from '@/types'

interface AuthContextValue {
  user: AuthUser | null
  modalOpen: boolean
  view: AuthView
  openAuth: (view?: AuthView) => void
  closeAuth: () => void
  setView: (view: AuthView) => void
  signIn: (user: AuthUser) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getSession())
  const [modalOpen, setModalOpen] = useState(false)
  const [view, setView] = useState<AuthView>('login')

  const openAuth = useCallback((next: AuthView = 'login') => { setView(next); setModalOpen(true) }, [])
  const closeAuth = useCallback(() => setModalOpen(false), [])
  const signIn = useCallback((next: AuthUser) => setUser(next), [])
  const signOut = useCallback(() => { logout(); setUser(null) }, [])

  const value = useMemo(
    () => ({ user, modalOpen, view, openAuth, closeAuth, setView, signIn, signOut }),
    [user, modalOpen, view, openAuth, closeAuth, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}