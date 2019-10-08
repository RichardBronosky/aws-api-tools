import { announce, taskDone } from '@helpers/aria-announce'

export const handleWindowEvents = e => {
  if (window.zoom) {
    if (e.key == 'Escape' || e.key == 'Enter' || e.keyCode == 32) {
      e.preventDefault()
      window.setZoom(false)
      if (window.zoomBtn && window.zoomBtn.current) {
        window.zoomBtn.current.setAttribute('aria-pressed', 'false')
        taskDone(
          () => {
            window.zoomBtn.current.focus()
          },
          500,
          'focusZoom'
        )
      }
    }
  }
}

export const handleZoomToggle = (e, zoom, setZoom, zoomBtn) => {
  if (!e) return
  e.stopPropagation()
  if (e.type == 'click' || e.key == 'Enter' || e.keyCode == 32 || !e.keyCode) {
    e.preventDefault()
    setZoom(zoom)
    if (zoomBtn && zoomBtn.current) {
      zoomBtn.current.setAttribute('aria-pressed', zoom)
    }
    if (zoom) {
      announce('Image Zoomed')
      window.addEventListener('keydown', handleWindowEvents)
      window['zoom'] = zoom
      window['setZoom'] = setZoom
      window['zoomBtn'] = zoomBtn
    } else {
      announce('Image Zoom Closed')
      window.removeEventListener('keydown', handleWindowEvents)
    }
  }
  if (e.key == 'Escape') {
    window.removeEventListener('keydown', handleWindowEvents)
    announce('Image Zoom Closed')
    setZoom(false)
    if (zoomBtn && zoomBtn.current) {
      zoomBtn.current.setAttribute('aria-pressed', 'false')
      taskDone(
        () => {
          zoomBtn.current.focus()
        },
        500,
        'focusZoom'
      )
    }
  }
}
