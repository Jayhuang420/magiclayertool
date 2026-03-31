import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLayerStore } from '../../stores/layerStore'
import ImageUploader from './ImageUploader'
import SegmentationCanvas from './SegmentationCanvas'
import LayerPanel from './LayerPanel'
import ExportDialog from './ExportDialog'

export default function LayerSeparatorPage() {
  const { t } = useTranslation()
  const { layers, reset } = useLayerStore()
  const navigate = useNavigate()
  const [showExport, setShowExport] = useState(false)
  const hasLayers = layers.length > 0

  const btnStyle = {
    padding: '6px 14px',
    border: '1px solid #475569',
    borderRadius: 6,
    cursor: 'pointer' as const,
    fontSize: 13,
    fontFamily: 'inherit',
    color: '#e2e8f0',
    backgroundColor: 'transparent',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {hasLayers && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
        }}>
          <button onClick={reset} style={btnStyle}>
            ↩ 重新上傳
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => navigate('/manual')}
            style={{ ...btnStyle, backgroundColor: '#334155' }}
          >
            📄 插入說明書
          </button>
          <button
            onClick={() => setShowExport(true)}
            style={{ ...btnStyle, backgroundColor: '#1d4ed8', color: '#fff', border: '1px solid #2563eb' }}
          >
            {t('layer.export')}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {hasLayers ? (
          <>
            <SegmentationCanvas />
            <LayerPanel />
          </>
        ) : (
          <ImageUploader />
        )}
      </div>

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </div>
  )
}
