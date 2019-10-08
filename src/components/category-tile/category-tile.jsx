import React from 'react'
import RTGLink from '@shared/link'
import classNames from 'classnames'
import SaleFlag from '@shared/sale-flag'
import { contentfulImage } from '@helpers/contentful'
import './category-tile.sass'

export default ({ category, isMobile }) => (
  <div
    className={ classNames('category-tile', {
      'category-small': category.collapsed,
      'category-small-image-top': category.collapsedImageTop,
    }) }
    key={ category.name }
  >
    <RTGLink
      data={ category.link }
      key={ category.name }
      className="card pop-out"
      category="category tile"
      action="click"
      label={ category.name }
      noAriaLabel="true"
    >
      { category.onSale && <SaleFlag>Sale</SaleFlag> }
      <span className="category-image">
        <img
          alt=""
          aria-hidden="true"
          role="presentation"
          src={ isMobile && category.mobileImage
              ? `${ contentfulImage(category.mobileImage.file.url) }&h=${ category.collapsed ? '150' : '350' }`
              : category.image
              ? `${ contentfulImage(category.image.file.url) }&h=${ category.collapsed ? '250' : '550' }`
              : '' }
        />
      </span>
      <div className={ classNames('category-name') } style={ { color: category.fontColor || '#333' } }>
        { category.name }
      </div>
    </RTGLink>
  </div>
)
