import { useTranslation } from 'react-i18next'
import type { Editor } from '@tiptap/react'

interface TemplateSelectorProps {
  editor: Editor | null
  onClose: () => void
}

const templates = [
  {
    id: 'basic',
    nameKey: 'manual.basicTemplate',
    description: '包含商品名稱、規格、特色說明',
    content: `
      <h1>商品名稱</h1>
      <p>請輸入商品簡短描述。</p>
      <h2>商品規格</h2>
      <table>
        <tr><th>項目</th><th>規格</th></tr>
        <tr><td>尺寸</td><td></td></tr>
        <tr><td>重量</td><td></td></tr>
        <tr><td>材質</td><td></td></tr>
        <tr><td>顏色</td><td></td></tr>
      </table>
      <h2>商品特色</h2>
      <ul><li>特色一</li><li>特色二</li><li>特色三</li></ul>
    `,
  },
  {
    id: 'detailed',
    nameKey: 'manual.detailedTemplate',
    description: '完整規格表、使用說明、保固資訊',
    content: `
      <h1>商品名稱</h1>
      <p>請輸入商品完整描述與賣點。</p>
      <h2>商品規格</h2>
      <table>
        <tr><th>項目</th><th>規格</th></tr>
        <tr><td>型號</td><td></td></tr>
        <tr><td>尺寸</td><td></td></tr>
        <tr><td>重量</td><td></td></tr>
        <tr><td>材質</td><td></td></tr>
        <tr><td>顏色</td><td></td></tr>
        <tr><td>產地</td><td></td></tr>
        <tr><td>保固期</td><td></td></tr>
      </table>
      <h2>商品特色</h2>
      <ul><li>特色一</li><li>特色二</li><li>特色三</li></ul>
      <h2>包裝內容</h2>
      <ul><li>商品本體 x1</li><li>使用說明書 x1</li><li>保固卡 x1</li></ul>
      <h2>使用說明</h2>
      <ol>
        <li>步驟一：開箱檢查配件是否齊全。</li>
        <li>步驟二：請依照圖示進行安裝。</li>
        <li>步驟三：使用完畢請妥善收納。</li>
      </ol>
      <h2>注意事項</h2>
      <ol>
        <li>請妥善保管本說明書以供日後參考。</li>
        <li>請依照指示正確使用本產品。</li>
        <li>請勿讓兒童自行操作。</li>
        <li>如有任何問題請聯繫客服。</li>
      </ol>
      <h2>保固資訊</h2>
      <p>本產品自購買日起享有 <strong>一年</strong> 保固服務。保固期間內，非人為因素造成之故障，可享免費維修服務。</p>
      <p>客服電話：0800-000-000</p>
      <p>客服信箱：service@example.com</p>
    `,
  },
]

export default function TemplateSelector({ editor, onClose }: TemplateSelectorProps) {
  const { t } = useTranslation()

  const applyTemplate = (content: string) => {
    if (!editor) return
    editor.commands.setContent(content)
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
          {t('manual.selectTemplate')}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: '#94a3b8',
            cursor: 'pointer', fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => applyTemplate(tpl.content)}
            style={{
              textAlign: 'left',
              padding: '14px 16px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'border-color 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155' }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
              {t(tpl.nameKey)}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {tpl.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
