/**
 * Enhanced API fetch utility with JWT token injection
 * Works with NextAuth.js for authentication
 */

// Get API base URL from environment variable, default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Options for apiFetch
 */
interface ApiFetchOptions extends RequestInit {
  /**
   * Access token for authentication (from NextAuth session)
   * If provided, automatically injects Bearer token
   * For client-side: use session.accessToken from useSession()
   * For server-side: use session.accessToken from auth()
   */
  accessToken?: string | null
}

/**
 * Enhanced fetch function with automatic token injection
 * @param path API endpoint path (relative to API_BASE_URL)
 * @param options Fetch options including accessToken
 * @returns Promise that resolves to the response data
 * @throws Error if request fails
 *
 * @example
 * // Client-side usage:
 * const { data: session } = useSession();
 * const data = await apiFetch('/api/endpoint', { accessToken: session?.accessToken });
 *
 * @example
 * // Server-side usage:
 * const session = await auth();
 * const data = await apiFetch('/api/endpoint', { accessToken: session?.accessToken });
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { accessToken, headers = {}, ...fetchOptions } = options

  // Build full URL - if path starts with http, use it as-is, otherwise prepend API_BASE_URL
  const fullUrl = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  // Prepare headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Inject Bearer token if provided
  if (accessToken) {
    requestHeaders['Authorization'] = `Bearer ${accessToken}`
  }

  // Make the request
  const res = await fetch(fullUrl, {
    ...fetchOptions,
    headers: requestHeaders,
  })

  // Handle non-OK responses
  if (!res.ok) {
    // Try to extract error message from response
    let errorMessage = `API failed with status ${res.status}`

    try {
      const errorData = await res.json()
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error
      }
    } catch {
      // If response is not JSON, use default error message
    }

    throw new Error(errorMessage)
  }

  // Return parsed JSON response
  return res.json() as Promise<T>
}
