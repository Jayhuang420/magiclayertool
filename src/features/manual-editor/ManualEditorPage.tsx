import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TipTapEditor from './TipTapEditor'
import EditorToolbar from './EditorToolbar'
import TemplateSelector from './TemplateSelector'
import type { Editor } from '@tiptap/react'

export default function ManualEditorPage() {
  const { t } = useTranslation()
  const [editor, setEditor] = useState<Editor | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Main Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <EditorToolbar editor={editor} onShowTemplates={() => setShowTemplates(!showTemplates)} />
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 800,
            minHeight: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: '48px 56px',
            color: '#1a1a1a',
            fontSize: 15,
            lineHeight: 1.8,
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}>
            <TipTapEditor onEditorReady={setEditor} />
          </div>
        </div>
      </div>

      {/* Template Sidebar */}
      {showTemplates && (
        <div style={{
          width: 280,
          backgroundColor: '#1e293b',
          borderLeft: '1px solid #334155',
          overflow: 'auto',
        }}>
          <TemplateSelector editor={editor} onClose={() => setShowTemplates(false)} />
        </div>
      )}
    </div>
  )
}
