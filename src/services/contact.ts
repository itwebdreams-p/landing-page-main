import type { ContactPayload } from '@/types'

/** TODO: send to your backend or email service. For now it simulates a successful submission. */
export async function submitContact(payload: ContactPayload): Promise<{ ok: true }> {
  void payload
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { ok: true }
}