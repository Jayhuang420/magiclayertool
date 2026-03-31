import { useTranslation } from 'react-i18next'
import { useLayerStore } from '../../stores/layerStore'

export default function LayerPanel() {
  const { t } = useTranslation()
  const { layers, selectedLayerId, selectLayer, updateLayer, removeLayer, reorderLayers } =
    useLayerStore()

  return (
    <div style={{
      width: 260,
      backgroundColor: '#1e293b',
      borderLeft: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #334155',
        fontSize: 13,
        fontWeight: 600,
        color: '#e2e8f0',
      }}>
        {t('layer.layerPanel')} ({layers.length})
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {layers.length === 0 && (
          <p style={{ padding: '16px 14px', color: '#64748b', fontSize: 13 }}>
            {t('layer.noImage')}
          </p>
        )}

        {[...layers].reverse().map((layer, reversedIdx) => {
          const isSelected = layer.id === selectedLayerId
          const originalIdx = layers.length - 1 - reversedIdx
          return (
            <div
              key={layer.id}
              onClick={() => selectLayer(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#334155' : 'transparent',
                borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
                transition: 'background-color 0.1s',
              }}
            >
              {/* Visibility toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  updateLayer(layer.id, { visible: !layer.visible })
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: 2,
                  opacity: layer.visible ? 1 : 0.4,
                }}
                title={t('layer.visibility')}
              >
                👁️
              </button>

              {/* Thumbnail */}
              <img
                src={layer.imageDataUrl}
                alt={layer.name}
                style={{
                  width: 36,
                  height: 36,
                  objectFit: 'contain',
                  borderRadius: 4,
                  backgroundColor: '#0f172a',
                  border: '1px solid #475569',
                }}
              />

              {/* Name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  value={layer.name}
                  onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e2e8f0',
                    fontSize: 13,
                    width: '100%',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {layer.width} x {layer.height}
                </div>
              </div>

              {/* Reorder buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (originalIdx < layers.length - 1) reorderLayers(originalIdx, originalIdx + 1)
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 10, color: '#94a3b8', padding: 0,
                  }}
                >
                  ▲
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (originalIdx > 0) reorderLayers(originalIdx, originalIdx - 1)
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 10, color: '#94a3b8', padding: 0,
                  }}
                >
                  ▼
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeLayer(layer.id)
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#ef4444', padding: 2,
                }}
                title={t('layer.deleteLayer')}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      {/* Opacity slider for selected layer */}
      {selectedLayerId && (() => {
        const sel = layers.find((l) => l.id === selectedLayerId)
        if (!sel) return null
        return (
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid #334155',
          }}>
            <label style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
              {t('layer.opacity')}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={sel.opacity}
                onChange={(e) => updateLayer(sel.id, { opacity: parseFloat(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span style={{ width: 36, textAlign: 'right' }}>{Math.round(sel.opacity * 100)}%</span>
            </label>
          </div>
        )
      })()}
    </div>
  )
}
