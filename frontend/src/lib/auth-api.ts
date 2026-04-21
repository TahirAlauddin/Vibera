const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export type SignupPayload = {
  username: string
  email: string
  password: string
  re_password: string
}

export type SignupResponse = {
  id: number
  email: string
  username: string
}

type DjangoErrorResponse = Record<string, string | string[]>

function formatDjangoErrors(data: DjangoErrorResponse): string {
  const messages: string[] = []

  for (const [field, errors] of Object.entries(data)) {
    const list = Array.isArray(errors) ? errors : [errors]
    for (const message of list) {
      if (field === 'non_field_errors') {
        messages.push(message)
      } else {
        messages.push(`${field.replace(/_/g, ' ')}: ${message}`)
      }
    }
  }

  return messages.join(' ') || 'Registration failed. Please try again.'
}

export async function registerUser(payload: SignupPayload): Promise<SignupResponse> {
  if (!API_BASE_URL) {
    throw new Error('API URL is not configured.')
  }

  const res = await fetch(`${API_BASE_URL}/api/auth/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(formatDjangoErrors(data as DjangoErrorResponse))
  }

  return data as SignupResponse
}
