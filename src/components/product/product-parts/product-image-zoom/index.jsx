import React from 'react'
import { handleWindowEvents } from './product-image-zoom-helper'
import ProductImageZoom from './product-image-zoom'

export default ({ product, image, isMobile }) => {
  const [zoom, setZoom] = React.useState(false)
  React.useEffect(() => {
    return () => window.removeEventListener('keydown', handleWindowEvents)
  }, [])
  return <ProductImageZoom product={ product } image={ image } zoom={ zoom } setZoom={ setZoom } />
}
