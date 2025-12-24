export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}
