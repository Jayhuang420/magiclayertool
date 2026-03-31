import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const navItems = [
  { path: '/layers', icon: '🖼️', labelKey: 'nav.layerSeparator' },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside style={{
      width: 220,
      backgroundColor: '#1e293b',
      borderRight: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
    }}>
      <div style={{
        padding: '0 16px 20px',
        borderBottom: '1px solid #334155',
        marginBottom: 12,
      }}>
        <h1 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#f1f5f9',
          letterSpacing: 1,
        }}>
          MagicLayerTool
        </h1>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
          {t('app.subtitle')}
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f1f5f9' : '#94a3b8',
                backgroundColor: isActive ? '#334155' : 'transparent',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#273548'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </button>
          )
        })}
      </nav>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #334155',
        fontSize: 11,
        color: '#64748b',
      }}>
        v1.0.0
      </div>
    </aside>
  )
}
