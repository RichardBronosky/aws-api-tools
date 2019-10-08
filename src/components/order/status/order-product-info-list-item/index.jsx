import React from 'react'
import { currencyFormatUS } from '@helpers/string-helper'
import './order-product-info-list-item.sass'

export default ({ product, classname }) => {
  const price =
    product && (product.PackagePrice && product.PackagePrice !== '0' ? product.PackagePrice : product.UnitPrice)
  return (
    <>
      { product && (
        <div className="grid-x cell small-12 order-product-info-list-item">
          <div className="grid-x cell small-12 order-status-product-info-headings">
            <div className={ `order-status-heading cell small-12 medium-4 large-7 ${ classname }` }>
              { product.DisplayName }
              <p>{ `SKU: ${ product.Sku }` }</p>
            </div>
            <div className="order-status-heading cell small-12 medium-2 large-1">{ product.Quantity }</div>
            <div className="order-status-heading cell small-12 medium-3 large-2">{ currencyFormatUS(price) }</div>
            <div className="order-status-heading subtotal cell small-12 medium-3 large-2">
              { currencyFormatUS(price * product.Quantity) }
            </div>
          </div>
        </div>
      ) }
    </>
  )
}
