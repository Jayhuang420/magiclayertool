import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { LayerData } from '../stores/layerStore'

/**
 * Export layers as a ZIP containing individual PNGs + manifest.json
 */
export async function exportLayersAsZip(layers: LayerData[], fileName: string = '圖層匯出') {
  const zip = new JSZip()

  const manifest = layers.map((layer, index) => ({
    name: layer.name,
    file: `${index}_${layer.name}.png`,
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    opacity: layer.opacity,
    visible: layer.visible,
    zIndex: layer.zIndex,
  }))

  zip.file('manifest.json', JSON.stringify(manifest, null, 2))

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    const base64Data = layer.imageDataUrl.replace(/^data:image\/\w+;base64,/, '')
    zip.file(`${i}_${layer.name}.png`, base64Data, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${fileName}.zip`)
}

/**
 * Export editor HTML as a styled HTML file (for PDF printing)
 */
export function exportEditorAsHTML(html: string, title: string = '商品說明書') {
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @media print {
      @page { margin: 20mm; size: A4; }
    }
    body {
      font-family: 'Noto Sans TC', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.8;
      color: #1a1a1a;
      font-size: 15px;
    }
    h1 { font-size: 24px; font-weight: 700; margin: 16px 0 8px; }
    h2 { font-size: 20px; font-weight: 600; margin: 20px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    h3 { font-size: 17px; font-weight: 600; margin: 16px 0 6px; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; }
    th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
    th { background-color: #f3f4f6; font-weight: 600; }
    img { max-width: 100%; border-radius: 4px; margin: 8px 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  saveAs(blob, `${title}.html`)
}

/**
 * Trigger browser print dialog for PDF export
 */
export function printEditorAsPDF(html: string, title: string = '商品說明書') {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @media print { @page { margin: 20mm; size: A4; } }
    body {
      font-family: 'Noto Sans TC', sans-serif;
      max-width: 700px; margin: 0 auto; padding: 20px;
      line-height: 1.8; color: #1a1a1a; font-size: 14px;
    }
    h1 { font-size: 22px; font-weight: 700; margin: 12px 0 6px; }
    h2 { font-size: 18px; font-weight: 600; margin: 16px 0 6px; border-bottom: 1px solid #ccc; padding-bottom: 3px; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    th, td { border: 1px solid #ccc; padding: 6px 10px; }
    th { background: #f5f5f5; font-weight: 600; }
    ul, ol { padding-left: 20px; }
    img { max-width: 100%; }
  </style>
</head>
<body>${html}</body>
</html>`)

  printWindow.document.close()
  // Wait for fonts to load before printing
  setTimeout(() => {
    printWindow.print()
  }, 1000)
}
