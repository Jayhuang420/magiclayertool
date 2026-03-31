const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8765'

export interface SegmentedLayer {
  name: string
  image_base64: string
  bounds: { x: number; y: number; w: number; h: number }
}

export type SupportedFileType = 'image' | 'pdf' | 'pptx'

export function detectFileType(file: File): SupportedFileType {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (ext === 'pptx') return 'pptx'
  return 'image'
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

export async function extractLayers(file: File): Promise<SegmentedLayer[]> {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${API_BASE}/api/extract`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.detail || `提取失敗: ${res.statusText}`)
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
