import React from 'react'
import RTGLink from '../../../shared/link'
import classNames from 'classnames'
import '../../../../assets/css/components/checkout/checkout-parts/delivery-section/delivery-product.sass'
import { decodeHtml } from '../../../../lib/helpers/string-helper'
import { productUrl } from '../../../../lib/helpers/route'

export default ({ product, productCount, quantity, index, noImage, requiredAddon }) => (
  <div
    key={ product.sku }
    className={ classNames('delivery-product', {
      separator: index !== productCount - 1,
    }) }
  >
    <div className="product-container grid-x">
      { !noImage && (
        <div className="product-image-container small-2 large-4">
          { !requiredAddon && product.primary_image && (
            <RTGLink
              data={ {
                url: productUrl(product.title ? decodeHtml(product.title) : product.sku, product.sku),
                altDesc: product.title ? product.title : '',
              } }
            >
              <img
                src={ `${ product.primary_image }${ product.sku !== '83333333' ? '&h=150' : '' }` }
                alt={ product.title }
                className="product-image"
              />
            </RTGLink>
          ) }
        </div>
      ) }
      <div
        className={ classNames('product-info', {
          'small-6 large-5': !noImage,
          'small-9': noImage,
        }) }
      >
        <RTGLink
          data={ {
            url: productUrl(product.title ? decodeHtml(product.title) : product.sku, product.sku),
            altDesc: product.title ? product.title : '',
          } }
          disabled={ requiredAddon }
        >
          <p>{ product.title ? decodeHtml(product.title) : `SKU: ${ product.sku }` }</p>
        </RTGLink>
      </div>
      <div className="quantity small-2">QTY: { ' ' + quantity }</div>
    </div>
  </div>
)
