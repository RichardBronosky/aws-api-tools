import React from 'react'
import PropTypes from 'prop-types'
import AddonSelection from './add-on-selection'
import classNames from 'classnames'
import { currencyFormatUS } from '../../../lib/helpers/string-helper'
import { isProductStrikeThrough } from '../../../lib/helpers/product'
import ProductIncludesSlider from '../../product/product-parts/product-includes-slider'
import RTGLink from '../../shared/link'
import QuantityDropdown from './quantity-dropdown'
import RemoveFromCart from './remove-from-cart'
import ProductLocation from '../../product/product-parts/product-location'
import { getRegionZone } from '../../../lib/helpers/geo-location'
import { productFinancing } from '../../../lib/helpers/finance'
import '../../../assets/css/components/cart/cart-parts/cart-product.sass'
import { productUrl } from '../../../lib/helpers/route'

export default class CartProduct extends React.Component {
  state = {
    showFinance: false,
    financeAmount: 0,
  }

  financeSetUp = () => {
    const finance = productFinancing(this.props.price * this.props.quantity)
    this.setState({
      showFinance: finance.showFinance,
      financeAmount: finance.financeAmount,
    })
  }

  componentDidMount() {
    this.financeSetUp()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.quantity !== this.props.quantity || prevProps.productCount !== this.props.productCount) {
      this.financeSetUp()
    }
  }

  render() {
    const { product, index, productCount, quantity, price, unavailableItem, activeAddons } = this.props
    const { financeAmount, showFinance } = this.state
    const strikethrough = isProductStrikeThrough(product)
    let items_in_room
    if (product.items_in_room) {
      items_in_room = product.items_in_room[`${ getRegionZone().region }`] || product.items_in_room
    }
    return (
      <div
        key={ product.sku }
        className={ classNames('cart-product cell small-12', {
          separator: index !== productCount - 1,
        }) }
      >
        { unavailableItem && unavailableItem.reason === 'region' && (
          <div id={ `region_${ product.sku }` } className="not-available-msg">
            Not Available in your region
          </div>
        ) }
        { unavailableItem && unavailableItem.reason === 'stock' && (
          <div id={ `stock_${ product.sku }` } className="not-available-msg">
            Out of Stock
          </div>
        ) }
        <div className="product-container cart-image-title-container grid-x ">
          <div className="product-image-container small-6 large-4">
            { product.primary_image && (
              <RTGLink
                data={ {
                  url: productUrl(product.title, product.sku),
                  altDesc: product.title,
                } }
                noAriaLabel={ true }
                aria-hidden={ true }
                tabIndex="-1"
                disabled={ product.category === 'gift-card' }
              >
                <img
                  src={ `${ product.primary_image }${ product.sku !== '83333333' ? '&h=150' : '' }` }
                  alt={ product.title }
                  className="product-image"
                />
              </RTGLink>
            ) }
          </div>
          <div className="product-info small-6  large-5">
            <RTGLink
              data={ {
                url: productUrl(product.title, product.sku),
                altDesc: product.title,
              } }
              noAriaLabel={ true }
              className={ classNames('product-title', {
                'not-available': unavailableItem,
              }) }
              aria-describedby={ unavailableItem
                  ? unavailableItem.reason == 'region'
                    ? `region_${ product.sku }`
                    : `stock_${ product.sku }`
                  : null }
              disabled={ product.addon_required || product.category === 'gift-card' }
            >
              <span id={ `ariaId_${ index }` } dangerouslySetInnerHTML={ { __html: product.title } } />
              <div className="cart-shipping">
                <ProductLocation cart product={ product } />
              </div>
            </RTGLink>
            <p className="sku-text">SKU: { product.sku }</p>
          </div>
          <div className="product-bar large-3">
            <div className="grid-x ">
              <div className="small-6 center">
                <div className="grid-x">
                  <div className="small-12 dropdown-remove">
                    <QuantityDropdown
                      ariaId={ `ariaId_${ index }` }
                      quantity={ quantity }
                      sku={ product.sku }
                      activeAddons={ activeAddons }
                    />
                  </div>

                  <div className="small-12 dropdown-remove">
                    <RemoveFromCart ariaId={ `ariaId_${ index }` } product={ product } index={ index } />
                  </div>
                </div>
              </div>
              <div className="small-6">
                <div className={ classNames('price-container', { 'show-finance': showFinance }) }>
                  <div className="pricing-box">
                    <div className="product-price">
                      { strikethrough && product.list_price && (
                        <p className="strikethrough">{ currencyFormatUS(product.list_price * quantity) }</p>
                      ) }
                      <p className={ strikethrough ? 'strikethrough-sale' : '' }>{ currencyFormatUS(price * quantity) }</p>
                    </div>
                    { showFinance && <p className="product-financing">{ currencyFormatUS(financeAmount) } a month*</p> }
                  </div>
                </div>
              </div>
            </div>
          </div>
          { product.addon_items && (
            <AddonSelection
              product={ product }
              productQuantity={ quantity }
              activeAddons={ activeAddons }
              cartIndex={ index }
            />
          ) }
          { items_in_room && items_in_room.length > 0 && (
            <ProductIncludesSlider items_in_room={ items_in_room } heading="Includes:" />
          ) }

          <div className={ product.addon_items ? 'mobile cell medium-6' : 'mobile cell medium-12' }>
            <div className="small-12 medium-1">
              <div className="cart-shipping">
                <ProductLocation cart />
              </div>
              <div className="price-container grid-x">
                <div
                  className={ product.addon_items
                      ? 'small-6 medium-3 medium-offset-6 grid-x'
                      : 'small-6 medium-2 medium-offset-8 grid-x' }
                >
                  <div className="small-12 left">
                    <QuantityDropdown quantity={ quantity } sku={ product.sku } activeAddons={ activeAddons } />
                  </div>
                  <div className="small-12 left">
                    <RemoveFromCart product={ product } index={ index } />
                  </div>
                </div>
                <div className={ product.addon_items ? 'small-6 medium-3 center' : 'small-6 medium-2 center' }>
                  <div className="pricing-box">
                    <div className="product-price">
                      { strikethrough && product.list_price && (
                        <p className="strikethrough">{ currencyFormatUS(product.list_price * quantity) }</p>
                      ) }
                      <p className={ strikethrough ? 'strikethrough-sale' : '' }>{ currencyFormatUS(price * quantity) }</p>
                    </div>
                    { showFinance && <p className="product-financing">{ currencyFormatUS(financeAmount) } a month*</p> }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CartProduct.propTypes = {
  index: PropTypes.number.isRequired,
  productCount: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  product: PropTypes.object.isRequired,
  unavailableItem: PropTypes.shape({
    sku: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
  }),
  onAddActiveAddon: PropTypes.func.isRequired,
  onRemoveActiveAddon: PropTypes.func.isRequired,
  activeAddons: PropTypes.array,
}
