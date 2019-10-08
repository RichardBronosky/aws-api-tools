import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import RTGLink from '../../shared/link'
import { getCartTotal } from '../../../lib/helpers/cart'
import { currencyFormatUS } from '../../../lib/helpers/string-helper'
import '../../../assets/css/components/checkout/checkout-sticky/checkout-sticky.sass'
import arrowUp from '../../../assets/images/icons8-chevron-up-24.png'
import arrowDown from '../../../assets/images/icons8-chevron-down-24.png'

import CheckoutStickyLocation from './checkout-sticky-location'
import PayPal from '../checkout-parts/payment-section/paypal'
import { getGiftCards } from '../../../lib/helpers/checkout/payment-section/gift-cards'
import { getRTGFinance } from '../../../lib/helpers/checkout/payment-section/rtg-finance'
import { getRemainingTotal } from '../../../lib/helpers/checkout/global'
import PaymentMethods from '../../cart/cart-parts/payment-methods'
import SalesContact from '../../cart/cart-parts/sales-contact'
import PromoModal from './promotions-modal'
import { getRoomsToGoDeliveryItems } from '../../../lib/helpers/checkout/delivery-section'

class CheckoutSticky extends React.Component {
  state = {
    expanded: false,
    promoExpanded: false,
  }

  closeModal = () => {
    this.setState({
      promoExpanded: false,
    })
  }

  render() {
    const {
      cart,
      isCheckout,
      productsAvailable,
      removeUnavailableItems,
      checkoutStepsCompleted,
      isMobile,
      onlyButtons,
      rightSticky,
      discount,
      showPayPal,
      order,
    } = this.props
    const { expanded, promoExpanded } = this.state
    const giftCards = order.giftCardInfo && order.giftCardInfo.useGiftCard && getGiftCards()
    const rtgFinance = getRTGFinance()
    const cartTotal = getCartTotal(cart)
    const orderValues = getRemainingTotal(
      checkoutStepsCompleted && checkoutStepsCompleted.delivery,
      cartTotal,
      isCheckout,
      checkoutStepsCompleted && checkoutStepsCompleted.shipping
    )
    let orderDiscount = discount
    if (discount > 0 && !isCheckout) {
      total -= parseFloat(discount)
    } else if (isCheckout) {
      orderDiscount = order && order.promotions && order.promotions.totalSavings
    }
    const thisTax = checkoutStepsCompleted.delivery && order.tax > -1 ? order.tax : -2
    const thisDeliveryCost =
      checkoutStepsCompleted.shipping &&
      (order.totalDeliveryCharge > 0 ||
        order.isPickup ||
        (order.lineItems.length && getRoomsToGoDeliveryItems(order.lineItems).length === 0))
        ? order.totalDeliveryCharge
        : -1
    let promoDescriptions = []
    if (order && order.promotions && order.promotions.promotions) {
      for (let i = 0, n = order.promotions.promotions.length; i < n; i++) {
        promoDescriptions.push({
          desc: order.promotions.promotions[i].description,
          amount: order.promotions.promotions[i].amount,
        })
      }
    }
    let total = orderValues.total
    if (order && (!isCheckout || !checkoutStepsCompleted.shipping)) {
      if (order.promotions && order.promotions.totalSavings && order.promotions.cartTotal) {
        total = order.promotions.cartTotal
      } else {
        total = cartTotal
      }
    }
    return (
      <>
        <div className="checkout-sticky cell small-12 large-4 grid-x">
          { isMobile && (
            <div
              aria-expanded={ isMobile && expanded }
              aria-controls="your-order-summary"
              className="order-detail-expander"
              onClick={ () => this.setState({ expanded: !expanded }) }
            >
              { !expanded ? (
                <img className="arrowUp" src={ arrowUp } alt="expand order details" />
              ) : (
                <img className="arrowDown" src={ arrowDown } alt="collapse order details" />
              ) }
            </div>
          ) }
          { (!isMobile || expanded) && !onlyButtons && (
            <>
              <div id="your-order-summary" className="cell small-12">
                <div className="checkout-header">
                  <h2>YOUR ORDER</h2>
                </div>

                <div className="checkout-info top grid-x">
                  <div className="cell small-12">
                    <div>{ !isCheckout && <CheckoutStickyLocation /> }</div>
                  </div>
                  <div className="small-7">
                    <p className="left bold">Subtotal</p>
                  </div>
                  <div className="small-5">
                    <p className="right bold">{ currencyFormatUS(cartTotal, true) }</p>
                  </div>
                  { orderDiscount > 0 && (
                    <>
                      <div className="small-7">
                        <button
                          className="left promos-button"
                          tabIndex="0"
                          value="See applied promotions"
                          aria-label="See applied promotions"
                          onClick={ () => this.setState({ promoExpanded: true }) }
                        >
                          Offers Applied
                        </button>
                      </div>
                      <div className="small-5">
                        <p className="right subtract">-{ currencyFormatUS(orderDiscount, true) }</p>
                      </div>
                    </>
                  ) }
                  <div className="small-7">
                    <p
                      className={ classNames('left ', {
                        bold: !isCheckout,
                      }) }
                    >
                      Shipping & Delivery
                    </p>
                  </div>
                  { (thisDeliveryCost < 0 || !isCheckout) && (
                    <div className="small-5">
                      <p className="right period ">{ '. .' }</p>
                    </div>
                  ) }
                  { thisDeliveryCost >= 0 && isCheckout && (
                    <div className="small-5">
                      <p className="right">{ currencyFormatUS(thisDeliveryCost, true) }</p>
                    </div>
                  ) }
                  { !isCheckout && (
                    <div className="small-12">
                      <p className="left small ">(calculated in checkout)</p>
                    </div>
                  ) }
                  <div className="small-7">
                    <p
                      className={ classNames('left ', {
                        bold: !isCheckout,
                      }) }
                    >
                      Sales Tax
                    </p>
                  </div>
                  { (!isCheckout || thisTax < 0) && (
                    <div className="small-5">
                      <p className="right period ">{ '. .' }</p>
                    </div>
                  ) }
                  { thisTax >= -1 && isCheckout && (
                    <div className="small-5">
                      { thisTax === -1 && <p className="right">{ '...calculating' }</p> }
                      { thisTax >= 0 && <p className="right">{ currencyFormatUS(thisTax, true) }</p> }
                    </div>
                  ) }
                  { !isCheckout && (
                    <div className="small-12">
                      <p className="left small">(calculated in checkout)</p>
                    </div>
                  ) }
                </div>
                { isCheckout && (giftCards.length > 0 || rtgFinance) && (
                  <div className="grid-x checkout-info">
                    { giftCards.length > 0 && orderValues.gift > 0 && (
                      <>
                        <div className="small-7">
                          <p className="left">
                            { order.paymentInfo && giftCards && (
                              <>
                                { giftCards.length < 2 && <>Gift Card</> }
                                { giftCards.length > 1 && <>Gift Cards</> }
                              </>
                            ) }
                          </p>
                        </div>
                        { thisTax === -1 && (
                          <div className="small-5">
                            <p className="right">{ '...calculating' }</p>
                          </div>
                        ) }
                        { thisTax >= 0 && (
                          <div className="small-5">
                            <p className="right subtract">-{ currencyFormatUS(orderValues.gift, true) }</p>
                          </div>
                        ) }
                      </>
                    ) }
                    { rtgFinance && orderValues.fin > 0 && (
                      <>
                        <div className="small-7">
                          <p className="left">RTG Finance</p>
                        </div>
                        { thisTax === -1 && (
                          <div className="small-5">
                            <p className="right">{ '...calculating' }</p>
                          </div>
                        ) }
                        { thisTax >= 0 && (
                          <div className="small-5">
                            <p className="right subtract">-{ currencyFormatUS(orderValues.fin, true) }</p>
                          </div>
                        ) }
                      </>
                    ) }
                  </div>
                ) }
              </div>
              <div id="your-order-total" className="checkout-info bottom grid-x">
                <div className="small-6">
                  <p className={ `total-txt ${ orderDiscount > 0 ? 'total-discount' : '' }` }>{ `Total${
                    orderDiscount > 0 ? ' After Discounts' : ''
                  }` }</p>
                </div>
                <div className="small-6">
                  { thisTax === -1 && <p className="right">{ '...calculating' }</p> }
                  { thisTax !== -1 && <p className="total-price bolder">{ currencyFormatUS(total, true) }</p> }
                </div>
              </div>
              { !isCheckout && (
                <div className="small-12 large-6 paypal-btn-container mobile">
                  <div className="grid-x">
                    <div className="small-12 medium-8 medium-offset-2 paypal">
                      <PayPal total={ total } order={ order } isMobile={ isMobile } show={ showPayPal } />
                    </div>
                  </div>
                </div>
              ) }
            </>
          ) }
          { ((isMobile && !expanded) || onlyButtons) && (
            <div className="cell small-12 checkout-info bottom grid-x">
              <div className="small-12 grid-x padding-lr">
                <div className="small-6">
                  <p className={ `total-txt ${ orderDiscount > 0 ? 'total-discount' : '' }` }>{ `Total${
                    orderDiscount > 0 ? ' After Discounts' : ''
                  }` }</p>
                </div>
                <div className="small-6">
                  { thisTax === -1 && <p className="right">{ '...calculating' }</p> }
                  { thisTax !== -1 && <p className="total-price bolder">{ currencyFormatUS(total, true) }</p> }
                </div>
              </div>
            </div>
          ) }
          { !isCheckout && (
            <div className="cell small-12 checkout-info bottom grid-x">
              { productsAvailable && (
                <div className="cell button-container small-12 medium-8 large-12 grid-x">
                  <div className="cell small-12 checkout-btn-container">
                    <RTGLink
                      data={ {
                        slug: '/checkout',
                        category: 'cart',
                        action: 'checkout',
                        label: 'checkout',
                      } }
                    >
                      <span className="action-btn checkout">Checkout now</span>
                    </RTGLink>
                  </div>
                  { (!isMobile || (isMobile && onlyButtons)) && rightSticky && (
                    <div className="cell small-12 paypal-btn-container">
                      <PayPal total={ total } order={ order } rightSticky={ rightSticky } show={ showPayPal } />
                    </div>
                  ) }
                </div>
              ) }
              { !productsAvailable && (
                <div className="cell unavailable-container small-12 medium-8 large-12 grid-x">
                  <div className="cell small-12 checkout-btn-container">
                    <button className="action-btn checkout disabled" value="Checkout Now" disabled>
                      Checkout now
                    </button>
                  </div>
                  <p className="disabled-text">
                    We apologize, but some items are out of stock or unavailable in your region. Please review your cart
                    and make changes as necessary.
                  </p>
                  <button
                    className="remove-unavailable"
                    value="Remove all unavailable items"
                    onClick={ removeUnavailableItems }
                  >
                    Remove all unavailable items
                  </button>
                </div>
              ) }
            </div>
          ) }
        </div>
        { (!isMobile || expanded) && !onlyButtons && rightSticky && (
          <div className="checkout-sticky grid-x cell small-12 sales-contact-info desktop">
            <div className="small-12">
              <PaymentMethods />
            </div>
            <SalesContact />
          </div>
        ) }
        { promoExpanded && (
          <PromoModal promoDescriptions={ promoDescriptions } modalOpen={ promoExpanded } closeModal={ this.closeModal } />
        ) }
      </>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.checkout, ...state.cart }
}

export default connect(
  mapStateToProps,
  null
)(CheckoutSticky)
