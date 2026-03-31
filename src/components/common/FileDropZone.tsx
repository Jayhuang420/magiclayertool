import { useCallback, useState, DragEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface FileDropZoneProps {
  onFile: (file: File) => void
  accept?: string
}

export default function FileDropZone({ onFile, accept = 'image/*,.pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation' }: FileDropZoneProps) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase()
        if (file.type.startsWith('image/') || ext === 'pdf' || ext === 'pptx') {
          onFile(file)
        }
      }
    },
    [onFile]
  )

  const handleClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) onFile(file)
    }
    input.click()
  }, [accept, onFile])

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      style={{
        border: `2px dashed ${isDragging ? '#3b82f6' : '#475569'}`,
        borderRadius: 12,
        padding: '48px 32px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragging ? 'rgba(59,130,246,0.1)' : 'rgba(30,41,59,0.5)',
        transition: 'all 0.2s ease',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
      <p style={{ fontSize: 16, color: '#e2e8f0', marginBottom: 8 }}>
        {t('layer.uploadHint')}
      </p>
      <p style={{ fontSize: 13, color: '#64748b' }}>
        {t('layer.pasteHint')}
      </p>
      <p style={{ fontSize: 12, color: '#475569', marginTop: 12 }}>
        PNG, JPG, WebP, PDF, PPTX
      </p>
    </div>
  )
}
