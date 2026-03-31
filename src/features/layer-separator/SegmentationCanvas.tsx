import { useRef, useEffect, useState, useCallback } from 'react'
import { useLayerStore } from '../../stores/layerStore'

interface CanvasLayer {
  id: string
  image: HTMLImageElement
  x: number
  y: number
  width: number
  height: number
  visible: boolean
  opacity: number
}

export default function SegmentationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { layers, selectedLayerId, selectLayer, updateLayer } = useLayerStore()
  const [loadedLayers, setLoadedLayers] = useState<CanvasLayer[]>([])
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; layerX: number; layerY: number } | null>(null)

  // Load images
  useEffect(() => {
    const loadAll = async () => {
      const loaded: CanvasLayer[] = await Promise.all(
        layers.map(
          (l) =>
            new Promise<CanvasLayer>((resolve) => {
              const img = new Image()
              img.onload = () =>
                resolve({
                  id: l.id,
                  image: img,
                  x: l.x,
                  y: l.y,
                  width: l.width,
                  height: l.height,
                  visible: l.visible,
                  opacity: l.opacity,
                })
              img.src = l.imageDataUrl
            })
        )
      )
      setLoadedLayers(loaded)
    }
    loadAll()
  }, [layers])

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Checkerboard background
    const size = 16
    for (let y = 0; y < canvas.height; y += size) {
      for (let x = 0; x < canvas.width; x += size) {
        ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? '#2a2a2a' : '#333333'
        ctx.fillRect(x, y, size, size)
      }
    }

    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    for (const layer of loadedLayers) {
      if (!layer.visible) continue
      ctx.globalAlpha = layer.opacity
      ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height)

      // Selection border
      if (layer.id === selectedLayerId) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2 / scale
        ctx.setLineDash([6 / scale, 4 / scale])
        ctx.strokeRect(layer.x, layer.y, layer.width, layer.height)
        ctx.setLineDash([])
      }
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }, [loadedLayers, selectedLayerId, scale, offset])

  useEffect(() => {
    draw()
  }, [draw])

  // Resize canvas to container
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const observer = new ResizeObserver(() => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      draw()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [draw])

  // Zoom with scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((s) => Math.min(Math.max(s * delta, 0.1), 10))
  }, [])

  // Click to select layer
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left - offset.x) / scale
      const my = (e.clientY - rect.top - offset.y) / scale

      // Find topmost clicked layer (reverse order)
      for (let i = loadedLayers.length - 1; i >= 0; i--) {
        const l = loadedLayers[i]
        if (!l.visible) continue
        if (mx >= l.x && mx <= l.x + l.width && my >= l.y && my <= l.y + l.height) {
          selectLayer(l.id)
          setDragging({ id: l.id, startX: e.clientX, startY: e.clientY, layerX: l.x, layerY: l.y })
          return
        }
      }
      selectLayer(null)
    },
    [loadedLayers, offset, scale, selectLayer]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return
      const dx = (e.clientX - dragging.startX) / scale
      const dy = (e.clientY - dragging.startY) / scale
      updateLayer(dragging.id, { x: dragging.layerX + dx, y: dragging.layerY + dy })
    },
    [dragging, scale, updateLayer]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflow: 'hidden', position: 'relative', backgroundColor: '#1a1a2e' }}
    >
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ display: 'block', cursor: dragging ? 'grabbing' : 'default' }}
      />
      <div style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        background: 'rgba(0,0,0,0.6)',
        padding: '4px 10px',
        borderRadius: 4,
        fontSize: 12,
        color: '#94a3b8',
      }}>
        {Math.round(scale * 100)}%
      </div>
    </div>
  )
}
