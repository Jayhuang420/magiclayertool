import { useCallback, useEffect } from 'react'
import FileDropZone from '../../components/common/FileDropZone'
import { useLayerStore } from '../../stores/layerStore'
import { segmentImage, SegmentedLayer } from '../../services/segmentationApi'
import { useTranslation } from 'react-i18next'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

function base64ToDataUrl(base64: string): string {
  return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`
}

export default function ImageUploader() {
  const { t } = useTranslation()
  const { isProcessing, error, setSourceImage, setLayers, setProcessing, setError } =
    useLayerStore()

  const processImage = useCallback(
    async (file: File) => {
      setProcessing(true)
      setError(null)

      try {
        const dataUrl = await fileToDataUrl(file)
        setSourceImage(dataUrl)

        const segments: SegmentedLayer[] = await segmentImage(file)

        const layers = segments.map((seg, i) => ({
          id: `layer-${Date.now()}-${i}`,
          name: seg.name,
          imageDataUrl: base64ToDataUrl(seg.image_base64),
          x: seg.bounds.x,
          y: seg.bounds.y,
          width: seg.bounds.w,
          height: seg.bounds.h,
          visible: true,
          locked: false,
          opacity: 1,
          zIndex: i,
        }))

        setLayers(layers)
      } catch (err) {
        setError(err instanceof Error ? err.message : '分割失敗')
      } finally {
        setProcessing(false)
      }
    },
    [setSourceImage, setLayers, setProcessing, setError]
  )

  // Support Ctrl+V paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) processImage(file)
          break
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [processImage])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 16,
    }}>
      {isProcessing ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>⚙️</div>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>{t('layer.processing')}</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          <FileDropZone onFile={processImage} />
          {error && (
            <p style={{ color: '#ef4444', fontSize: 14, marginTop: 8 }}>{error}</p>
          )}
        </>
      )}
    </div>
  )
}
