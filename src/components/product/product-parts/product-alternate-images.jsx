import React from 'react'
import classNames from 'classnames'

export default ({ image, alternate_images, currentImage, setImage }) => (
  <div className="cell small-2 grid-x grid-margin-x">
    { image && (
      <button
        key={ image }
        tabIndex="0"
        value="View primary image"
        aria-label="View primary image"
        onClick={ () => setImage(image) }
        className={ classNames('product-alternate-image cell small-4 medium-4 large-1', {
          selected: !currentImage || currentImage === image,
        }) }
      >
        <img src={ `${ image }&h=150` } alt="primary image" />
      </button>
    ) }
    { alternate_images &&
      alternate_images.map((img, index) => (
        <button
          key={ index }
          tabIndex="0"
          value="View alternate image"
          aria-label="View alternate image"
          onClick={ () => setImage(img) }
          className={ classNames('product-alternate-image cell small-4 medium-4 large-1', {
            selected: currentImage === img,
          }) }
        >
          <img src={ img } alt={ `alternate image ${ index + 1 }` } />
        </button>
      )) }
  </div>
)
