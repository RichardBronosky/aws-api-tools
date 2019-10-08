import React from 'react'
import RTGLink from '../../shared/link'
import SaleFlag from '../../shared/sale-flag'
import classNames from 'classnames'

import AlternateImages from '../product-parts/product-alternate-images'
import AddToCart from '../product-parts/product-add-to-cart'
import ProductFinancing from '../product-parts/product-financing'
import ProductLocation from '../product-parts/product-location'
import ProductPrice from '../product-parts/product-price'
import Variations from '../product-parts/product-variations'
import { analyticsProduct } from '../../../lib/helpers/google-tag-manager'
import { fetchProductBySku } from '../../../lib/services/product'
import { productUrl } from '../../../lib/helpers/route'
import { scrollToPLP } from '../../../lib/helpers/product'

export default class ProductInfoGrid extends React.Component {
  state = {
    focused: false,
  }

  setFocus = () => {
    this.setState({
      focused: true,
    })
  }

  removeFocus = (event = null) => {
    let code = event ? event.keyCode || event.which : null
    if (
      !code ||
      (code === 9 && event.target.className === 'buy-now focused') ||
      (!event ||
        (event.shiftKey &&
          event.keyCode == 9 &&
          typeof event.target.className === 'string' &&
          event.target.className.includes('product-image-link')))
    ) {
      this.setState({
        focused: false,
      })
    }
  }

  handleVariationClick = variation => {
    fetchProductBySku(variation.sku).then(product => this.props.setProduct(product))
  }

  renderProductVariations() {
    const { orderedProductVariations, product } = this.props
    let variationType = null
    if (orderedProductVariations) {
      if (orderedProductVariations.color && orderedProductVariations.color.length > 0) {
        variationType = 'color'
      } else if (orderedProductVariations.finish && orderedProductVariations.finish.length > 0) {
        variationType = 'finish'
      }
    }
    return variationType ? (
      <div className={ `${ variationType }-variation` }>
        <Variations
          handleVariationClick={ this.handleVariationClick }
          variations={ orderedProductVariations[variationType] }
          productSku={ product.sku }
          noImage={ variationType === 'size' }
        />
      </div>
    ) : null
  }

  render() {
    const {
      product,
      price,
      strikethrough,
      strikethroughPrice,
      availability,
      sale,
      fullWidth,
      currentImage,
      setImage,
      index,
      source,
      gridWidth,
      isMobile,
      addons,
      displayQuantity,
      showFinance,
      financeAmount,
      last,
    } = this.props

    return (
      <div
        onKeyDown={ e => this.removeFocus(e) }
        className={ classNames('product-tile plp-grid card', {
          'pop-out': !fullWidth,
          wide: fullWidth,
          focused: this.state.focused,
        }) }
      >
        { product && (
          <div className="item product grid-margin-x">
            <span id={ `cell${ product.objectID }` } className="hide508">{ `${ product.brand ? product.brand : '' } ${
              product.collection
            }` }</span>
            { sale && <SaleFlag>Sale</SaleFlag> }
            { displayQuantity > 1 && <div className="item-count">qty: { displayQuantity }</div> }
            <RTGLink
              className="product-image-link"
              data={ {
                slug: productUrl(product.title ? product.title : 'product', product.sku),
                category: 'product tile',
                action: 'click',
                label: product.sku,
                value: index + 1,
              } }
              trackingData={ {
                event: 'ee_click',
                ecommerce: { click: { position: index + 1, products: [analyticsProduct(product, 1, index + 1)] } },
              } }
              aria-hidden="true"
              role="presentation"
              tabIndex="-1"
            >
              <span
                className={ classNames('product-image', { loading: !(product.primary_image || product.grid_image) }) }
              >
                { (product.primary_image || product.grid_image) && (
                  <img
                    src={ `${ gridWidth <= 2 ? product.primary_image : product.grid_image || product.primary_image }&${
                      isMobile ? 'h=250' : 'h=385'
                    }` }
                    className="small-image"
                    alt=""
                    onLoad={ last ? scrollToPLP() : _ => _ }
                  />
                ) }
              </span>
            </RTGLink>
            { fullWidth && (
              <AlternateImages
                image={ product.primary_image }
                alternate_images={ product.alternate_images }
                currentImage={ currentImage }
                setImage={ setImage }
              />
            ) }
            <div className="product-details-section">
              <div className="product-details-data grid-x">
                { fullWidth && (
                  <div className="instock-instore cell small-12">
                    <ProductLocation />
                  </div>
                ) }
                <div className="product-variation-title cell small-12 ">
                  <div className="product-variation-image-list cell small-8">
                    <div className="product-variations">
                      <div
                        className={ classNames('product-variation-info', {
                          hidden: product.variations
                            ? !product.variations.hasOwnProperty('size') || product.category === 'mattress bedding'
                            : true,
                        }) }
                      >
                        More Sizes Available
                      </div>
                      { product.variations && (
                        <div className="product-variation-swatches">{ this.renderProductVariations() }</div>
                      ) }
                    </div>
                  </div>
                  <RTGLink
                    data={ {
                      slug: productUrl(product.title ? product.title : 'product', product.sku),
                      category: 'product tile',
                      action: 'click',
                      label: product.sku,
                    } }
                  >
                    <span className="product-info cell small-12 ">
                      <span className="product-title link" dangerouslySetInnerHTML={ { __html: product.title } } />
                    </span>
                  </RTGLink>
                </div>
                <div
                  className={ classNames('product-pricing small-12', {
                    'large-4': fullWidth,
                  }) }
                >
                  { price && (
                    <div className="product-price cell grid-y small-12">
                      <div className={ classNames({ 'small-6': showFinance, 'small-12': !showFinance }) }>
                        <ProductPrice
                          price={ price }
                          sale={ sale }
                          strikethrough={ strikethrough }
                          strikethroughPrice={ strikethroughPrice }
                        />
                        { showFinance && (
                          <div className="small-6">
                            <ProductFinancing financeAmount={ financeAmount } />
                          </div>
                        ) }
                      </div>
                    </div>
                  ) }
                </div>
                <div className="buy-button cell small-12">
                  <AddToCart
                    availability={ availability }
                    product={ product }
                    price={ price }
                    componentPage="product tile"
                    focused={ this.state.focused }
                    removeFocus={ this.removeFocus }
                    source={ source }
                    addons={ addons || product.addon_items }
                    activeAddons={ [] }
                    index={ index + 1 }
                    moreInfoButton={ isMobile }
                  />
                </div>
              </div>
            </div>
          </div>
        ) }
      </div>
    )
  }
}
