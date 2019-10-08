import React from 'react'
import { connect } from 'react-redux'
import { getCartTotal } from '../../lib/helpers/cart'
import { currencyFormatUS } from '../../lib/helpers/string-helper'
import { isProductStrikeThrough } from '../../lib/helpers/product'
import RTGLink from '../shared/link'
import RemoveFromCart from '../cart/cart-parts/remove-from-cart'
import { productUrl } from '../../lib/helpers/route'

class CartPopout extends React.Component {
  render() {
    const cart = this.props.cart
    return (
      <>
        <div className="section">
          <div id="cartSubtotal" className="subtotal">
            Subtotal: { currencyFormatUS(getCartTotal(cart)) }
          </div>
        </div>
        { (!cart || (cart && typeof cart.cartItems === 'undefined')) && (
          <>
            <div className="section">
              <div className="message">Your shopping cart is empty</div>
            </div>
            { /* <div className="section">
              <div className="notice">
                <p>
                  If you saved items on a previous visit,{ ' ' }
                  <a href="/">Sign In</a> to access your saved cart.
                  </p>
              </div>
            </div> */ }
          </>
        ) }
        <div className="section sticky">
          <RTGLink
            data={ {
              slug: '/checkout',
              title: 'Checkout',
              category: 'header',
              action: 'cart interaction',
              label: 'checkout',
            } }
          >
            <span className="blue-action-btn checkout">Checkout</span>
          </RTGLink>
          <RTGLink
            data={ {
              slug: '/cart',
              title: 'View Full Cart',
              category: 'header',
              action: 'cart interaction',
              label: 'view full cart',
            } }
            className="bold-arrow-link"
          >
            View Full Cart >
          </RTGLink>
        </div>
        { cart && cart.cartItems && cart.cartItems.length > 0 && (
          <>
            { cart.cartItems &&
              cart.cartItems.map((item, index) => {
                const product = item.product
                const strikethrough = isProductStrikeThrough(product)
                return (
                  <div key={ index } className="line-item grid-x">
                    <div className="product cell small-10">
                      <RTGLink
                        data={ {
                          url: productUrl(product.title, product.sku),
                        } }
                        aria-hidden="true"
                        tabIndex="-1"
                        disabled={ product.category === 'gift-card' }
                      >
                        <div className="prod-img">
                          <img src={ product.primary_image } alt="" role="presentation" />
                        </div>
                      </RTGLink>
                      <div className="prod-details">
                        <RTGLink
                          data={ {
                            url: productUrl(product.title, product.sku),
                          } }
                          aria-describedby={ `mcq_${ index }mcp_${ index }` }
                          disabled={ product.category === 'gift-card' }
                        >
                          <div className="title">{ product.title }</div>
                        </RTGLink>
                        <div id={ 'mcq_' + index } className="qty">
                          Qty: { item.quantity }
                        </div>
                        <div id={ 'mcp_' + index } className="price">
                          { strikethrough && (
                            <p className="strikethrough">{ currencyFormatUS(item.product.list_price) }</p>
                          ) }
                          <p className={ strikethrough ? 'strikethrough-sale' : '' }>{ currencyFormatUS(item.price) }</p>
                        </div>
                      </div>
                    </div>

                    <div className="cell small-2">
                      <RemoveFromCart headerCart product={ product } index={ index } />
                    </div>
                  </div>
                )
              }) }
          </>
        ) }
      </>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.cart }
}

export default connect(
  mapStateToProps,
  null
)(CartPopout)
