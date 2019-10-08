import React from 'react'
import classNames from 'classnames'
import '../../../assets/css/components/product/product-parts/add-to-cart.sass'
import ProductLocation from '../product-parts/product-location'
import { decodeHtml } from '../../../lib/helpers/string-helper'
import AddToCartModal from './add-to-cart-modal'
import { addToDataLayer } from '../../../lib/helpers/google-tag-manager'
import RTGLink from '../../shared/link'
import { productUrl } from '../../../lib/helpers/route'

export default class AddToCart extends React.Component {
  state = {
    modalOpen: false,
    stockMessage: '',
  }

  componentDidUpdate(prevProps) {
    if (this.props.stockMessage && prevProps.stockMessage !== this.props.stockMessage) {
      this.setState({
        stockMessage: this.props.stockMessage,
      })
    }
  }

  onAddToCart = event => {
    const { product, componentPage } = this.props
    event.preventDefault()
    addToDataLayer('click', componentPage, 'add to cart', product.sku)
    if (!this.state.modalOpen) {
      this.setState({
        modalOpen: true,
      })
    }
  }

  closeModal = () => {
    if (this.state.modalOpen) {
      if (this.props.removeFocus) {
        this.props.removeFocus(false)
      }
      this.setState({
        modalOpen: false,
      })
    }
  }

  render() {
    const {
      product,
      availability,
      price,
      focused,
      stockMessage,
      index,
      source,
      addons,
      requiredSelected,
      activeAddons,
      buttonText,
      promoDescription,
      promoItems,
      promoQualifierQuantity,
      promoTargetQuantity,
      promoTargetPrice,
      promoStrikethroughPrice,
    } = this.props
    return (
      <>
        <div
          className={ classNames('buy-now-popup grid-x', {
            focused: focused,
          }) }
        >
          { !this.props.hideShipping && (
            <div className="instock-instore cell small-12">
              <ProductLocation product={ product } />
            </div>
          ) }
          <div className="cell small-12 grid-x grid-padding-x">
            { this.props.moreInfoButton && (
              <div className={ classNames(`cell small-6`) }>
                { product && product.title && product.sku && (
                  <RTGLink
                    data={ {
                      url: productUrl(product.title ? decodeHtml(product.title) : product.sku, product.sku),
                      altDesc: product.title ? product.title : '',
                      text: 'More Info',
                    } }
                    className="buy-now more-info"
                  />
                ) }
              </div>
            ) }
            <div className={ classNames(`cell small-${ this.props.moreInfoButton ? '6' : '12' }`) }>
              { (availability &&
                (!stockMessage ||
                  stockMessage === '' ||
                  (stockMessage !== 'Out of stock' &&
                    stockMessage !== 'Discontinued' &&
                    stockMessage !== 'Available Soon'))) ||
              source === 'search' ? (
                <button
                  className={ classNames('buy-now', {
                    focused: focused,
                  }) }
                  aria-label={ `Add To Cart for ${ product.title ? product.title : '' }` }
                  value="Add To Cart"
                  onClick={ e => this.onAddToCart(e) }
                >
                  { buttonText ? buttonText : 'add to cart' }
                </button>
              ) : (
                <button
                  className={ classNames('buy-now unavailable', {
                    focused: focused,
                  }) }
                  aria-label={ `Unavailable ${ product.title ? product.title : '' }` }
                  value="Unavailable"
                  disabled
                >
                  not available
                </button>
              ) }
            </div>
          </div>
        </div>
        { this.state.modalOpen && (
          <AddToCartModal
            modalOpen={ this.state.modalOpen }
            product={ product }
            price={ price }
            closeModal={ this.closeModal }
            stockMessage={ this.state.stockMessage }
            addons={ addons }
            requiredSelected={ requiredSelected }
            activeAddons={ activeAddons }
            index={ index }
            promoDescription={ promoDescription }
            promoItems={ promoItems }
            promoQualifierQuantity={ promoQualifierQuantity }
            promoTargetQuantity={ promoTargetQuantity }
            promoTargetPrice={ promoTargetPrice }
            promoStrikethroughPrice={ promoStrikethroughPrice }
          />
        ) }
      </>
    )
  }
}
