import React from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import '../../assets/css/components/checkout/checkout.sass'
import loaderDark from '../../assets/images/loader-dark.svg'
import { getFromBrowserStorage } from '../../lib/helpers/storage'

import CondensedContact from '../shared/condensed-contact-links'
import CheckoutSticky from './checkout-sticky/checkout-sticky'
import CheckoutStep from './checkout-parts/checkout-step'
import CheckoutEmpty from './checkout-parts/checkout-empty'

import ShippingSection from './checkout-parts/shipping-section'
import DeliverySection from './checkout-parts/delivery-section'
import PaymentSection from './checkout-parts/payment-section'
import ReviewSection from './checkout-parts/review-section'
import { setupCheckoutAnalytics } from '../../lib/helpers/google-tag-manager'
import DeclineModal from './checkout-parts/decline-modal'
import { setCart } from '../../redux/modules/cart'
import { setOrder, setCheckoutStep, setCheckoutStepsCompleted } from '../../redux/modules/checkout'
import { createOrder, updateLineItems } from '../../lib/services/checkout'
import { getLineItems } from '../../lib/helpers/checkout/global'
import { getCurrentLocation } from '../../lib/helpers/geo-location'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

class Checkout extends React.Component {
  state = {
    paymentInfo: {
      rtgCreditInfo: {
        cardNumber: '',
        zip: '',
      },
      financePlan: {
        code: '',
        hasPayments: true,
      },
      useGiftCard: false,
      giftCardNumber: '',
      giftCardPin: '',
      giftCardInfo: [],
      addAnotherCard: false,
      billingDifferent: false,
      billingSubmitted: false,
    },
    paymentInvalidFields: [],
    reviewInfo: {
      acceptTerms: false,
      acceptPickupTerms: false,
    },
    reviewInvalidFields: [],
    declineModalOpen: false,
    declineCloseLoading: false,
    declineType: 'credit card',
  }

  async componentDidMount() {
    const {
      order,
      onSetOrder,
      checkoutStep,
      onSetCheckoutStep,
      checkoutStepsCompleted,
      onSetCheckoutStepsCompleted,
      onSetCart,
    } = this.props
    const cartStorage = getFromBrowserStorage('local', 'cart')
    if (cartStorage) {
      onSetCart(cartStorage)
      setupCheckoutAnalytics(cartStorage)
    }
    const orderStorage = getFromBrowserStorage('session', 'order')
    const hasDeprecatedPaymentType = this.checkPaymentType(orderStorage)
    if (
      orderStorage &&
      orderStorage.lineItems &&
      orderStorage.lineItems.length > 0 &&
      JSON.stringify(order) !== JSON.stringify(orderStorage) &&
      !hasDeprecatedPaymentType
    ) {
      onSetOrder(orderStorage)
    } else if (hasDeprecatedPaymentType || !orderStorage || (orderStorage && !orderStorage.orderId)) {
      const location = getCurrentLocation()
      const lineItems = getLineItems()
      const orderResp = await createOrder({
        lineItems: lineItems,
        region: location.region,
        zone: parseInt(location.price_zone),
        distribution_index: parseInt(location.distribution_index),
      })
      onSetCheckoutStep('shipping')
      if (orderResp && orderResp.orderId) {
        onSetOrder(orderResp)
      }
    } else if (orderStorage && orderStorage.orderId) {
      const lineItems = getLineItems()
      const orderResp = await updateLineItems({
        orderId: orderStorage.orderId,
        lineItems: lineItems,
      })
      if (orderResp && orderResp.orderId) {
        onSetOrder(orderResp)
      }
    }
    const checkoutStepStorage = getFromBrowserStorage('session', 'checkoutStep')
    if (order && checkoutStepStorage && checkoutStep !== checkoutStepStorage) {
      onSetCheckoutStep(checkoutStepStorage)
    }
    const checkoutStepsCompletedStorage = getFromBrowserStorage('session', 'checkoutStepsCompleted')
    if (order && checkoutStepsCompletedStorage && checkoutStepsCompleted !== checkoutStepsCompletedStorage) {
      onSetCheckoutStepsCompleted(checkoutStepsCompletedStorage)
    }
  }

  checkPaymentType(order) {
    if (order && order.paymentInfo) {
      return order.paymentInfo.some(payment => payment.paymentType === 'CYBER')
    }
    return false
  }

  render() {
    const { order, isMobile, declineModalInfo } = this.props
    return (
      <>
        { order && order.lineItems && order.lineItems.length > 0 && (
          <section className="cell small-12 grid-x grid-margin-y checkout-page">
            <div className="cell small-12 checkout-page-header">
              <h1>CHECKOUT</h1>
            </div>
            <div
              className={ `cell small-12 grid-x grid-margin-y checkout-section-steps ${
                !this.props.isMobile ? 'grid-padding-x' : ''
              }` }
            >
              <div className="checkout-section-container cell small-12 large-9 grid-x grid-margin-y">
                <div id="shipping" className="cell small-12">
                  <CheckoutStep
                    sectionTitle="Shipping Address"
                    sectionType="shipping"
                    sectionNumber="1"
                    nextSection="delivery"
                  >
                    <ShippingSection />
                  </CheckoutStep>
                </div>
                <div id="delivery" className="cell small-12">
                  <CheckoutStep
                    sectionTitle="Delivery"
                    sectionType="delivery"
                    sectionNumber="2"
                    previousSection="shipping"
                    nextSection="payment"
                  >
                    <DeliverySection />
                  </CheckoutStep>
                </div>
                <div id="payment" className="cell small-12">
                  <CheckoutStep
                    sectionTitle="Payment"
                    sectionType="payment"
                    sectionNumber="3"
                    previousSection="delivery"
                    nextSection="review"
                  >
                    <PaymentSection />
                  </CheckoutStep>
                </div>
                <div id="review" className="cell small-12">
                  <CheckoutStep
                    sectionTitle="Review Order"
                    sectionType="review"
                    sectionNumber="4"
                    previousSection="payment"
                  >
                    <ReviewSection />
                  </CheckoutStep>
                </div>
              </div>
              <div
                className={ `checkout-container cell small-12 large-3 ${ !this.props.isMobile ? 'grid-margin-y' : '' }` }
              >
                <CheckoutSticky
                  isCheckout
                  tax={ order.tax }
                  deliveryCost={ order.totalDeliveryCharge }
                  isMobile={ isMobile }
                />
              </div>
              <div className="cell small-12 large-9 checkout-contact">
                <CondensedContact />
              </div>
            </div>
          </section>
        ) }
        { order && order.lineItems && order.lineItems.length < 1 && <CheckoutEmpty /> }
        { !order && <img alt="checkout loading" src={ loaderDark } /> }
        <DeclineModal
          modalOpen={ declineModalInfo.declineModalOpen }
          type={ declineModalInfo.declineType }
          loading={ declineModalInfo.declineCloseLoading }
        />
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.global,
    ...state.cart,
    order: state.checkout.order,
    checkoutStep: state.checkout.checkoutStep,
    checkoutStepsCompleted: state.checkout.checkoutStepsCompleted,
    declineModalInfo: state.checkout.declineModalInfo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetCart: cart => dispatch(setCart(cart)),
    onSetOrder: order => dispatch(setOrder(order)),
    onSetCheckoutStep: checkoutStep => dispatch(setCheckoutStep(checkoutStep)),
    onSetCheckoutStepsCompleted: checkoutStepsCompleted => dispatch(setCheckoutStepsCompleted(checkoutStepsCompleted)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkout)
