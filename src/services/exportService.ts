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

