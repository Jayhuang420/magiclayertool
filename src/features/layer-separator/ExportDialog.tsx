import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLayerStore } from '../../stores/layerStore'
import { exportLayersAsZip } from '../../services/exportService'

interface ExportDialogProps {
  onClose: () => void
}

export default function ExportDialog({ onClose }: ExportDialogProps) {
  const { t } = useTranslation()
  const { layers } = useLayerStore()
  const [fileName, setFileName] = useState('圖層匯出')
  const [exporting, setExporting] = useState(false)

  const handleExportZip = async () => {
    setExporting(true)
    try {
      await exportLayersAsZip(layers, fileName)
      onClose()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1e293b',
          borderRadius: 12,
          padding: 24,
          width: 400,
          border: '1px solid #334155',
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>
          {t('layer.export')}
        </h3>

        <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 12 }}>
          {t('common.fileName')}
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 4,
              padding: '8px 12px',
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: 6,
              color: '#e2e8f0',
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <button
            onClick={handleExportZip}
            disabled={exporting}
            style={{
              padding: '10px 16px',
              backgroundColor: '#1d4ed8',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'inherit',
              opacity: exporting ? 0.6 : 1,
            }}
          >
            {exporting ? '匯出中...' : t('layer.exportPNG')}
          </button>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            將每個圖層匯出為獨立 PNG 檔案，打包成 ZIP
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid #475569',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
