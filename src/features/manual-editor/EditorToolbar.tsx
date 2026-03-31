import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLayerStore } from '../../stores/layerStore'
import { exportEditorAsHTML, printEditorAsPDF } from '../../services/exportService'
import type { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
  onShowTemplates: () => void
}

interface ToolButton {
  label: string
  action: (editor: Editor) => void
  isActive?: (editor: Editor) => boolean
}

export default function EditorToolbar({ editor, onShowTemplates }: EditorToolbarProps) {
  const { t } = useTranslation()
  const { layers } = useLayerStore()
  const [showLayerPicker, setShowLayerPicker] = useState(false)

  if (!editor) return null

  const btnStyle = (active: boolean) => ({
    padding: '4px 8px',
    border: '1px solid ' + (active ? '#3b82f6' : '#475569'),
    borderRadius: 4,
    cursor: 'pointer' as const,
    fontSize: 13,
    fontFamily: 'inherit',
    color: active ? '#3b82f6' : '#e2e8f0',
    backgroundColor: active ? 'rgba(59,130,246,0.15)' : 'transparent',
    minWidth: 32,
  })

  const groups: ToolButton[][] = [
    [
      { label: 'B', action: (e) => e.chain().focus().toggleBold().run(), isActive: (e) => e.isActive('bold') },
      { label: 'I', action: (e) => e.chain().focus().toggleItalic().run(), isActive: (e) => e.isActive('italic') },
      { label: 'U', action: (e) => e.chain().focus().toggleUnderline().run(), isActive: (e) => e.isActive('underline') },
      { label: 'S', action: (e) => e.chain().focus().toggleStrike().run(), isActive: (e) => e.isActive('strike') },
    ],
    [
      { label: 'H1', action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (e) => e.isActive('heading', { level: 1 }) },
      { label: 'H2', action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e) => e.isActive('heading', { level: 2 }) },
      { label: 'H3', action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (e) => e.isActive('heading', { level: 3 }) },
    ],
    [
      { label: '• ' + t('manual.bulletList'), action: (e) => e.chain().focus().toggleBulletList().run(), isActive: (e) => e.isActive('bulletList') },
      { label: '1. ' + t('manual.orderedList'), action: (e) => e.chain().focus().toggleOrderedList().run(), isActive: (e) => e.isActive('orderedList') },
    ],
    [
      { label: '⬅', action: (e) => e.chain().focus().setTextAlign('left').run(), isActive: (e) => e.isActive({ textAlign: 'left' }) },
      { label: '⬛', action: (e) => e.chain().focus().setTextAlign('center').run(), isActive: (e) => e.isActive({ textAlign: 'center' }) },
      { label: '➡', action: (e) => e.chain().focus().setTextAlign('right').run(), isActive: (e) => e.isActive({ textAlign: 'right' }) },
    ],
    [
      {
        label: t('manual.table'),
        action: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
    ],
    [
      { label: '↩ ' + t('manual.undo'), action: (e) => e.chain().focus().undo().run() },
      { label: '↪ ' + t('manual.redo'), action: (e) => e.chain().focus().redo().run() },
    ],
  ]

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      padding: '8px 16px',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155',
      alignItems: 'center',
      position: 'relative',
    }}>
      {groups.map((group, gi) => (
        <div key={gi} style={{ display: 'flex', gap: 3, marginRight: 8 }}>
          {group.map((btn, bi) => (
            <button
              key={bi}
              onClick={() => btn.action(editor)}
              style={btnStyle(btn.isActive?.(editor) ?? false)}
              title={btn.label}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ))}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, position: 'relative' }}>
        {/* Insert layer image */}
        {layers.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLayerPicker(!showLayerPicker)}
              style={{ ...btnStyle(false), backgroundColor: '#334155' }}
            >
              🖼️ {t('manual.insertLayerImage')}
            </button>

            {showLayerPicker && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: 8,
                padding: 8,
                minWidth: 200,
                maxHeight: 300,
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                <p style={{ fontSize: 12, color: '#94a3b8', padding: '4px 8px', margin: 0 }}>
                  點擊圖層插入至說明書
                </p>
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => {
                      editor.chain().focus().setImage({ src: layer.imageDataUrl, alt: layer.name }).run()
                      setShowLayerPicker(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '6px 8px',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      fontFamily: 'inherit',
                      color: '#e2e8f0',
                      fontSize: 13,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#334155' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <img
                      src={layer.imageDataUrl}
                      alt={layer.name}
                      style={{
                        width: 32, height: 32,
                        objectFit: 'contain',
                        borderRadius: 3,
                        backgroundColor: '#0f172a',
                      }}
                    />
                    <span>{layer.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onShowTemplates}
          style={{ ...btnStyle(false), backgroundColor: '#334155' }}
        >
          {t('manual.templates')}
        </button>

        {/* Export dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              const html = editor.getHTML()
              printEditorAsPDF(html, '商品說明書')
            }}
            style={{
              ...btnStyle(false),
              backgroundColor: '#1d4ed8',
              color: '#fff',
              border: '1px solid #2563eb',
            }}
          >
            🖨️ {t('manual.exportPDF')}
          </button>
        </div>

        <button
          onClick={() => {
            const html = editor.getHTML()
            exportEditorAsHTML(html, '商品說明書')
          }}
          style={{ ...btnStyle(false), backgroundColor: '#334155' }}
        >
          📥 匯出 HTML
        </button>
      </div>
    </div>
  )
}
