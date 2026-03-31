import { create } from 'zustand'

interface EditorStore {
  documentJson: Record<string, unknown> | null
  documentTitle: string
  isDirty: boolean

  setDocumentJson: (json: Record<string, unknown>) => void
  setDocumentTitle: (title: string) => void
  setDirty: (dirty: boolean) => void
  reset: () => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  documentJson: null,
  documentTitle: '未命名商品說明書',
  isDirty: false,

  setDocumentJson: (json) => set({ documentJson: json, isDirty: true }),
  setDocumentTitle: (title) => set({ documentTitle: title }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  reset: () =>
    set({
      documentJson: null,
      documentTitle: '未命名商品說明書',
      isDirty: false,
    }),
}))
