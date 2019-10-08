import React from 'react'
import AddToCart from './product-add-to-cart'
import ProductPrice from './product-price'
import ProductFinancing from './product-financing'
import classNames from 'classnames'
import { productAvailability, productPrice, productOnSale } from '../../../lib/helpers/product'
import RTGLink from '../../shared/link'
import { productUrl } from '../../../lib/helpers/route'

export default ({
  product,
  showImage,
  addons,
  requiredSelected,
  activeAddons,
  moreInfo,
  strikethrough,
  strikethroughPrice,
  showFinance,
  financeAmount,
}) => (
  <div className="product-details-data grid-x grid-margin-x">
    <div
      className={ classNames('product-variation-title cell grid-x', {
        'small-6 large-8': !moreInfo && !strikethrough,
        'small-12 large-7': moreInfo || (!moreInfo && strikethrough),
      }) }
    >
      { showImage && (
        <div className="product-details-data-image cell small-2">
          <img src={ `${ product.primary_image }&w=150` } />
        </div>
      ) }
      <div className={ `product-info cell small-${ showImage ? '10' : '12' }` }>
        <div className="product-title" dangerouslySetInnerHTML={ { __html: product.title } } />
      </div>
    </div>
    <div
      className={ classNames('product-pricing cell', {
        'small-6 large-4': !moreInfo && !strikethrough,
        'small-12 large-5': moreInfo || (!moreInfo && strikethrough),
      }) }
    >
      <div className="grid-x cell small-12 list-price-container">
        <div
          className={ classNames('product-price-financing cell grid-y', {
            'small-12 medium-12 large-7': !moreInfo,
            'small-12 medium-12 large-6': moreInfo,
          }) }
        >
          <div
            className={ classNames('product-list-price cell', {
              'large-9': !showFinance,
              'large-6': showFinance,
            }) }
          >
            <ProductPrice
              price={ productPrice(product) }
              sale={ productOnSale(product) }
              strikethrough={ strikethrough }
              strikethroughPrice={ strikethroughPrice }
            />
          </div>
          { showFinance && (
            <div className="product-list-financing cell large-7">
              <ProductFinancing financeAmount={ financeAmount } />
            </div>
          ) }
        </div>
        <div
          className={ classNames('product-list-availability cell', {
            'small-12 medium-12 large-5': !moreInfo,
            'small-12 medium-12 large-6': moreInfo,
          }) }
        >
          { (moreInfo && (
            <div className="buy-now-popup more-info-btn">
              <RTGLink
                data={ {
                  url: productUrl(product.title, product.sku),
                  altDesc: product.title ? product.title : '',
                  text: 'More Info',
                } }
                className="buy-now"
              />
            </div>
          )) || (
            <AddToCart
              availability={ productAvailability(product) }
              product={ product }
              price={ productPrice(product) }
              hideShipping={ true }
              addons={ addons }
              requiredSelected={ requiredSelected }
              activeAddons={ activeAddons }
            />
          ) }
        </div>
      </div>
    </div>
  </div>
)
