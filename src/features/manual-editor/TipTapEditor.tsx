import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditorStore } from '../../stores/editorStore'
import type { Editor } from '@tiptap/react'

interface TipTapEditorProps {
  onEditorReady: (editor: Editor) => void
}

export default function TipTapEditor({ onEditorReady }: TipTapEditorProps) {
  const { setDocumentJson } = useEditorStore()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: '在此輸入商品說明...' }),
    ],
    content: `
      <h1>商品名稱</h1>
      <p>在此輸入您的商品名稱與簡短描述。</p>
      <h2>商品規格</h2>
      <table>
        <tr><th>項目</th><th>規格</th></tr>
        <tr><td>尺寸</td><td></td></tr>
        <tr><td>重量</td><td></td></tr>
        <tr><td>材質</td><td></td></tr>
        <tr><td>顏色</td><td></td></tr>
      </table>
      <h2>商品特色</h2>
      <ul>
        <li>特色一</li>
        <li>特色二</li>
        <li>特色三</li>
      </ul>
      <h2>使用說明</h2>
      <p>請在此輸入使用方式與注意事項。</p>
      <h2>注意事項</h2>
      <ol>
        <li>請妥善保管本說明書以供日後參考。</li>
        <li>請依照指示正確使用本產品。</li>
      </ol>
    `,
    editorProps: {
      attributes: {
        lang: 'zh-TW',
        style: 'outline: none; min-height: 400px;',
      },
    },
    onUpdate: ({ editor }) => {
      setDocumentJson(editor.getJSON() as Record<string, unknown>)
    },
  })

  useEffect(() => {
    if (editor) onEditorReady(editor)
  }, [editor, onEditorReady])

  return (
    <>
      <style>{`
        .tiptap h1 { font-size: 24px; font-weight: 700; margin: 16px 0 8px; }
        .tiptap h2 { font-size: 20px; font-weight: 600; margin: 20px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
        .tiptap h3 { font-size: 17px; font-weight: 600; margin: 16px 0 6px; }
        .tiptap p { margin: 8px 0; }
        .tiptap ul, .tiptap ol { padding-left: 24px; margin: 8px 0; }
        .tiptap li { margin: 4px 0; }
        .tiptap table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        .tiptap th, .tiptap td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
        .tiptap th { background-color: #f3f4f6; font-weight: 600; }
        .tiptap img { max-width: 100%; border-radius: 4px; margin: 8px 0; }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
      <EditorContent editor={editor} className="tiptap" />
    </>
  )
}
