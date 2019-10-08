import React from 'react'
import RTGLink from '../shared/link'
import { contentfulImage } from '../../lib/helpers/contentful'
import '../../assets/css/components/collection-tile/collection-tile.sass'

export default ({ isMobile, collection }) => (
  <div className="collection-tile" key={ collection.name }>
    <RTGLink
      data={ collection.link }
      key={ collection.name }
      className="card"
      category="collection tile"
      action="click"
      label={ collection.name }
      noAriaLabel={ true }
    >
      <div className="collection-image">
        <img
          alt=""
          aria-hidden="true"
          role="presentation"
          src={ isMobile && collection.mobileImage
              ? `${ contentfulImage(collection.mobileImage.file.url) }&h=350`
              : collection.image
              ? `${ contentfulImage(collection.image.file.url) }&h=550`
              : '' }
        />
      </div>
      <div className="collection-name">{ collection.heading }</div>
      <div className="collection-description">{ collection.description }</div>
      <div className="collection-link-text">VIEW THE COLLECTION >></div>
    </RTGLink>
  </div>
)
