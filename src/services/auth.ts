import type { AuthUser, BookingRole } from '@/types'

/**
 * Login / registration service.
 *
 * DEMO MODE: there is no backend yet, so accounts are stored in this browser's
 * localStorage. It works end to end for the UI, but it is NOT real security.
 *
 * TODO (when your backend is ready): replace the bodies of `register`, `login`,
 * `logout` and `getSession` with real API calls, e.g.
 *   const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({...}) })
 * Keep the function signatures the same and no UI code needs to change.
 */

const USERS_KEY = 'shankh.auth.users'
const SESSION_KEY = 'shankh.auth.session'

interface StoredUser extends AuthUser { passwordHash: string }

export type AuthField = 'name' | 'identifier' | 'phone' | 'email' | 'password' | 'form'
export type AuthResult = { ok: true; user: AuthUser } | { ok: false; field: AuthField; message: string }

/* ----------------------------- validation helpers ----------------------------- */

export const normalizePhone = (value: string) => value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
export const isValidPhone = (value: string) => /^[6-9]\d{9}$/.test(normalizePhone(value))
export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

/* --------------------------------- storage ----------------------------------- */

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): boolean {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return true
  } catch {
    return false
  }
}

function toPublic({ passwordHash: _hash, ...user }: StoredUser): AuthUser {
  return user
}

async function hashPassword(password: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(`shankh::${password}`)
    const digest = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  return btoa(unescape(encodeURIComponent(`shankh::${password}`)))
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/* ---------------------------------- API ------------------------------------- */

export function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function saveSession(user: AuthUser) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch { /* private mode: session lasts until refresh */ }
}

export function logout() {
  try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}

export interface RegisterInput { name: string; phone: string; email: string; password: string; role: BookingRole }

export async function register(input: RegisterInput): Promise<AuthResult> {
  await wait(700)
  const users = readUsers()
  const phone = normalizePhone(input.phone)
  const email = input.email.trim().toLowerCase()

  if (users.some((u) => u.phone === phone)) {
    return { ok: false, field: 'phone', message: 'An account with this mobile number already exists. Try logging in.' }
  }
  if (email && users.some((u) => u.email === email)) {
    return { ok: false, field: 'email', message: 'An account with this email already exists. Try logging in.' }
  }

  const stored: StoredUser = {
    id: globalThis.crypto?.randomUUID?.() ?? `u-${Date.now()}`,
    name: input.name.trim(),
    phone,
    email,
    role: input.role,
    passwordHash: await hashPassword(input.password),
  }
  if (!writeUsers([...users, stored])) {
    return { ok: false, field: 'form', message: 'Could not save your account in this browser. Turn off private mode and try again.' }
  }

  const user = toPublic(stored)
  saveSession(user)
  return { ok: true, user }
}

export async function login(identifier: string, password: string): Promise<AuthResult> {
  await wait(700)
  const id = identifier.trim()
  const byEmail = id.includes('@')
  const users = readUsers()
  const found = users.find((u) => (byEmail ? u.email === id.toLowerCase() : u.phone === normalizePhone(id)))

  if (!found) {
    return { ok: false, field: 'identifier', message: 'No account found. Check the details or register a new account.' }
  }
  if (found.passwordHash !== (await hashPassword(password))) {
    return { ok: false, field: 'password', message: 'Incorrect password. Please try again.' }
  }

  const user = toPublic(found)
  saveSession(user)
  return { ok: true, user }
}