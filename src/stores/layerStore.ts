import { create } from 'zustand'

export interface LayerData {
  id: string
  name: string
  imageDataUrl: string
  x: number
  y: number
  width: number
  height: number
  visible: boolean
  locked: boolean
  opacity: number
  zIndex: number
}

interface LayerStore {
  sourceImage: string | null
  layers: LayerData[]
  selectedLayerId: string | null
  isProcessing: boolean
  error: string | null

  setSourceImage: (dataUrl: string) => void
  setLayers: (layers: LayerData[]) => void
  addLayer: (layer: LayerData) => void
  removeLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<LayerData>) => void
  reorderLayers: (fromIndex: number, toIndex: number) => void
  selectLayer: (id: string | null) => void
  setProcessing: (v: boolean) => void
  setError: (e: string | null) => void
  reset: () => void
}

export const useLayerStore = create<LayerStore>((set) => ({
  sourceImage: null,
  layers: [],
  selectedLayerId: null,
  isProcessing: false,
  error: null,

  setSourceImage: (dataUrl) => set({ sourceImage: dataUrl }),

  setLayers: (layers) => set({ layers, selectedLayerId: layers[0]?.id ?? null }),

  addLayer: (layer) =>
    set((state) => ({ layers: [...state.layers, layer] })),

  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    })),

  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  reorderLayers: (fromIndex, toIndex) =>
    set((state) => {
      const newLayers = [...state.layers]
      const [moved] = newLayers.splice(fromIndex, 1)
      newLayers.splice(toIndex, 0, moved)
      return { layers: newLayers.map((l, i) => ({ ...l, zIndex: i })) }
    }),

  selectLayer: (id) => set({ selectedLayerId: id }),

  setProcessing: (v) => set({ isProcessing: v }),

  setError: (e) => set({ error: e }),

  reset: () =>
    set({
      sourceImage: null,
      layers: [],
      selectedLayerId: null,
      isProcessing: false,
      error: null,
    }),
}))
