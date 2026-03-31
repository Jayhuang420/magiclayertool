const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8765'

export interface SegmentedLayer {
  name: string
  image_base64: string
  bounds: { x: number; y: number; w: number; h: number }
}

export async function segmentImage(file: File): Promise<SegmentedLayer[]> {
  const form = new FormData()
  form.append('image', file)

  const res = await fetch(`${API_BASE}/api/segment`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    throw new Error(`分割失敗: ${res.statusText}`)
  }

  return res.json()
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}
