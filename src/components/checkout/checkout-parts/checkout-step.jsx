import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import PayPal from './payment-section/paypal'
import VisaCheckout from './payment-section/visa-checkout'
import Affirm from './payment-section/affirm'
import { getCreditCardDecision } from '../../../lib/helpers/checkout/payment-section/credit-card'
import { setCheckoutStep } from '../../../lib/helpers/checkout/global'
import loaderLight from '../../../assets/images/loader-light.svg'
import '../../../assets/css/components/checkout/checkout-parts/checkout-step.sass'

const checkoutSteps = ['shipping', 'delivery', 'payment', 'review']

class CheckoutStep extends React.Component {
  render() {
    const {
      order,
      sectionTitle,
      sectionType,
      sectionNumber,
      previousSection,
      nextSection,
      checkoutStep,
      children,
      loading,
      onSetCheckoutStep,
    } = this.props

    const currentIndex = checkoutSteps.indexOf(checkoutStep) + 1
    let creditProceed = false
    if (order && order.selectedPaymentType === 'Credit') {
      creditProceed = getCreditCardDecision()
    }
    let pp, vc, af
    if (order && order.paymentInfo) {
      pp = order.paymentInfo.filter(payment => payment.paymentType === 'PALV2').length > 0
      vc = order.paymentInfo.filter(payment => payment.paymentType === 'VISA').length > 0
      af = order.paymentInfo.filter(payment => payment.paymentType === 'AFF').length > 0
    }
    const remaining = order.amountDue ? order.amountDue : 1
    return (
      <div className="section">
        <div className="section-header">
          <i className="icon circle">
            <p className="section-number">{ sectionNumber }</p>
          </i>
          <h2 className="section-title">{ sectionTitle }</h2>
          { checkoutStep !== sectionType && (
            <button
              className={ classNames('edit-btn', { disabled: currentIndex < sectionNumber }) }
              value="Edit"
              disabled={ currentIndex < sectionNumber }
              aria-label={ currentIndex < sectionNumber
                  ? 'Complete ' + previousSection + ' step before proceeding to ' + sectionTitle
                  : false }
              onClick={ e => setCheckoutStep(e, checkoutStep, sectionType) }
            >
              EDIT <span className="hide508">{ sectionTitle }</span>
            </button>
          ) }
        </div>
        <div className="section-content">
          { children }
          { checkoutStep === sectionType && (
            <>
              { checkoutStep !== 'review' &&
                (checkoutStep !== 'payment' ||
                  (order &&
                    order.selectedPaymentType !== 'Credit' &&
                    order.amountDue <= 0 &&
                    order.selectedPaymentType === 'Rooms To Go') ||
                  creditProceed ||
                  ((order.selectedPaymentType === 'PayPal' && pp) ||
                    (order.selectedPaymentType === 'Visa Checkout' && vc) ||
                    (order.selectedPaymentType === 'Affirm' && af) ||
                    (order.amountDue <= 0 && order.giftCardInfo.useGiftCard))) && (
                  <div className="btn-container">
                    <button
                      className="continue-btn"
                      value="Continue"
                      onClick={ e => !loading && setCheckoutStep(e, checkoutStep, nextSection) }
                    >
                      { !loading && <>Continue</> }
                      { loading && <img className="loader" alt={ `Submitting ${ checkoutStep }` } src={ loaderLight } /> }
                    </button>
                  </div>
                ) }
              { checkoutStep === 'review' && (
                <div className="btn-container">
                  <button
                    className="place-order-btn"
                    value="Place your order"
                    onClick={ e => !loading && setCheckoutStep(e, checkoutStep, nextSection, true) }
                  >
                    { !loading && <>Place your order</> }
                    { loading && <img className="loader" alt="Placing order" src={ loaderLight } /> }
                  </button>
                </div>
              ) }
              { checkoutStep === 'payment' && (
                <>
                  { order && order.selectedPaymentType === 'PayPal' && !pp && remaining > 0 && (
                    <div className="btn-container">
                      <PayPal
                        style={ {
                          color: 'blue',
                          shape: 'rect',
                          size: 'medium',
                          tagline: false,
                          label: 'pay',
                        } }
                        isCheckout
                        onSetCheckoutStep={ onSetCheckoutStep }
                      />
                    </div>
                  ) }
                  { order && order.selectedPaymentType === 'Visa Checkout' && !vc && remaining > 0 && (
                    <div className="btn-container">
                      <VisaCheckout order={ order } onSetCheckoutStep={ onSetCheckoutStep } />
                    </div>
                  ) }
                  { order && order.selectedPaymentType === 'Affirm' && !af && remaining > 0 && (
                    <div className="btn-container">
                      <Affirm />
                    </div>
                  ) }
                </>
              ) }
            </>
          ) }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { order: state.checkout.order, checkoutStep: state.checkout.checkoutStep, loading: state.checkout.loading }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetCheckoutStep: checkoutStep => dispatch(setCheckoutStep(checkoutStep)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutStep)
