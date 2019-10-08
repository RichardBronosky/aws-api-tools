import React from 'react'
import { handleZoomToggle } from './product-image-zoom-helper'
import zoomIcon from '@images/search-plus-solid.svg'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

export default ({ product, image, zoom, setZoom, isMobile }) => {
  const zoomBtn = React.useRef(null)
  return (
    <>
      <div
        ref={ zoomBtn }
        className="product-image cell small-10"
        role="button"
        aria-pressed="false"
        tabIndex="0"
        aria-describedby="imageZoomInstructions"
        onClick={ e => handleZoomToggle(e, true, setZoom, zoomBtn) }
        onKeyDown={ e => handleZoomToggle(e, true, setZoom, zoomBtn) }
      >
        <img className="small-image" src={ `${ image }&h=550` } alt={ product.title } />
        <img className="zoom-icon" alt="zoom icon" src={ zoomIcon } />
      </div>
      { zoom && (
        <Lightbox
          mainSrc={ image }
          imageTitle={ product.title }
          closeLabel="close zoomed image"
          imagePadding={ isMobile ? 65 : 10 }
          onCloseRequest={ e => handleZoomToggle(e, false, setZoom, zoomBtn) }
        />
      ) }
    </>
  )
}
