import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LayerSeparatorPage from './features/layer-separator/LayerSeparatorPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/layers" element={<LayerSeparatorPage />} />
        <Route path="*" element={<Navigate to="/layers" replace />} />
      </Routes>
    </Layout>
  )
}
