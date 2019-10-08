import React from 'react'
import classNames from 'classnames'
import CondensedContact from '../shared/condensed-contact-links'
import CartProduct from './cart-parts/cart-product'
import CreditCardBanner from './cart-parts/credit-card-banner'
import CartEmpty from './cart-parts/cart-empty'
import CheckoutSticky from '../checkout/checkout-sticky/checkout-sticky'
import PaymentMethods from './cart-parts/payment-methods'
import PromotionContentGroup from '../shared/promotion-content-group'
import { removeUnavailableItems } from '../../lib/helpers/cart'
import '../../assets/css/components/cart/cart.sass'

export default ({
  cart,
  isMobile,
  onAddActiveAddon,
  onRemoveActiveAddon,
  skusNotAvailable,
  discount,
  showPayPal,
  promoTargetSkus,
  setCartState,
}) => (
  <div className="cart-page">
    <h1 id="main-cart-title" tabIndex="-1">
      CART
    </h1>
    <div
      className={ classNames('grid-x', {
        'grid-margin-x': isMobile,
      }) }
    >
      <div
        className={ classNames('cart-product-list-container small-12 medium-12 large-9 grid-x grid-padding-y', {
          cell: isMobile,
        }) }
      >
        { cart &&
          cart.cartItems &&
          cart.cartItems.map((item, index) => (
            <CartProduct
              key={ index }
              product={ item.product }
              index={ index }
              productCount={ cart.cartItems.length }
              quantity={ item.quantity }
              price={ item.price }
              unavailableItem={ skusNotAvailable.filter(prod => prod.sku === item.sku)[0] }
              activeAddons={ item.activeAddons }
              onAddActiveAddon={ onAddActiveAddon }
              onRemoveActiveAddon={ onRemoveActiveAddon }
            />
          )) }
        { (!cart || (cart && cart.cartItems && cart.cartItems.length < 1) || (cart && !cart.cartItems)) && <CartEmpty /> }
        { cart && cart.cartItems && cart.cartItems.length > 0 && (
          <>
            <PromotionContentGroup targetSkus={ promoTargetSkus } isCart />
            <div className="cart-bottom-checkout cell small-12 grid-x">
              <div className="cell large-8 payment-methods">
                <PaymentMethods />
              </div>
              <CheckoutSticky
                cart={ cart }
                productsAvailable={ skusNotAvailable.length < 1 }
                removeUnavailableItems={ () => removeUnavailableItems(setCartState, skusNotAvailable) }
                onlyButtons
                discount={ discount }
                showPayPal={ showPayPal }
              />
            </div>
          </>
        ) }
        { cart && cart.cartItems && cart.cartItems.length > 0 && (
          <>
            <p className="financing-disclaimer cell small-12">*when paying with a rooms to go credit card</p>
            <CreditCardBanner />
          </>
        ) }
        <CondensedContact />
      </div>
      <div className="checkout-container cell small-12 large-2 grid-margin-y">
        { cart && cart.cartItems && cart.cartItems.length > 0 && (
          <CheckoutSticky
            cart={ cart }
            isMobile={ isMobile }
            productsAvailable={ skusNotAvailable.length < 1 }
            removeUnavailableItems={ () => removeUnavailableItems(setCartState, skusNotAvailable) }
            rightSticky
            discount={ discount }
            showPayPal={ showPayPal }
          />
        ) }
      </div>
    </div>
  </div>
)
