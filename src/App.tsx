import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LayerSeparatorPage from './features/layer-separator/LayerSeparatorPage'
import ManualEditorPage from './features/manual-editor/ManualEditorPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/layers" element={<LayerSeparatorPage />} />
        <Route path="/manual" element={<ManualEditorPage />} />
        <Route path="*" element={<Navigate to="/layers" replace />} />
      </Routes>
    </Layout>
  )
}
