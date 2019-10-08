import React from 'react'
import classNames from 'classnames'
import ReactToolTip from 'react-tooltip'
import { setOrderInfo } from '../../../../lib/helpers/checkout/global'
import { shouldShowPayments } from '../../../../lib/helpers/checkout/payment-section/payment-section'
import { affirmAllowed as affirmIsAllowed } from '../../../../lib/helpers/checkout/payment-section/affirm'
import '../../../../assets/css/components/checkout/checkout-parts/payment-section/payment-section.sass'

import BillingAddress from './billing-address'
import PaymentCondensed from './payment-condensed'
import GiftCards from './gift-cards'
import CreditCardMicroform from './credit-card-microform'
import RoomsToGoCredit from './rooms-to-go-credit'
import ErrorMessage from '../checkout-error-message'
import { getCreditCardDecision } from '../../../../lib/helpers/checkout/payment-section/credit-card'

export default class PaymentSection extends React.Component {
  render() {
    const { order, checkoutStep, checkoutStepsCompleted, invalidFields } = this.props
    const showPaymentMethods = shouldShowPayments(order)
    const decision = getCreditCardDecision()
    const affirmAllowed = affirmIsAllowed(order)
    let hideMore = false
    if (order && order.paymentInfo && order.paymentInfo.length > 0) {
      const fin = order.paymentInfo.filter(payment => payment.paymentType === 'FIN')
      if (fin.length === 1 && order.paymentInfo.length === 1) {
        hideMore = order.amountDue <= 0
      }
    }
    const morePaymentMethods =
      order.selectedPaymentType === 'PayPal' ||
      order.selectedPaymentType === 'Visa Checkout' ||
      order.selectedPaymentType === 'Affirm' ||
      order.selectedPaymentType === 'ApplePay'
    return (
      <>
        { checkoutStep !== 'payment' && order.amountDue <= 0 && checkoutStepsCompleted.payment && (
          <PaymentCondensed order={ order } />
        ) }
        { checkoutStep === 'payment' && (
          <div className="payment-form">
            <p className="required-label">*Asterisks indicate required fields in the form below</p>
            { invalidFields.length > 0 && (
              <ErrorMessage customMessage="Cannot continue until a payment has been submitted." />
            ) }
            <div className="payment-form-container small-12 large-8">
              <div
                className={ classNames('gift-card-container', {
                  'gift-cards-active': order.giftCardInfo.useGiftCard,
                }) }
              >
                <GiftCards order={ order } />
              </div>
              { (order.amountDue > 0 || !order.amountDue) && showPaymentMethods && (
                <div className="grid-x" role="tablist" aria-label="Payment Method">
                  <button
                    className={ classNames('payment-type cell small-4', {
                      active: order.selectedPaymentType === 'Credit' && !morePaymentMethods,
                      disabled: hideMore,
                    }) }
                    role="tab"
                    id="tab1"
                    data-tip
                    data-tip-disable={ !hideMore }
                    data-for="creditDisabled"
                    tabIndex={ order.selectedPaymentType === 'Credit' && !morePaymentMethods ? 0 : -1 }
                    aria-selected={ order.selectedPaymentType === 'Credit' && !morePaymentMethods }
                    aria-controls="panel1"
                    onClick={ () => {
                      if ((order.selectedPaymentType !== 'Credit' || morePaymentMethods) && !hideMore) {
                        setOrderInfo('Credit', 'selectedPaymentType')
                      }
                    } }
                  >
                    <span className="payment-type-text">Credit Card</span>
                  </button>
                  <ReactToolTip id="creditDisabled" place="top" type="dark" effect="float">
                    Must remove financing to use another payment method.
                  </ReactToolTip>
                  <button
                    className={ classNames('payment-type cell small-4', {
                      active: order.selectedPaymentType === 'Rooms To Go' && !morePaymentMethods,
                    }) }
                    role="tab"
                    id="tab2"
                    tabIndex={ order.selectedPaymentType === 'Rooms To Go' && !morePaymentMethods ? 0 : -1 }
                    aria-selected={ order.selectedPaymentType === 'Rooms To Go' && !morePaymentMethods }
                    aria-controls="panel2"
                    onClick={ () => {
                      setOrderInfo('Rooms To Go', 'selectedPaymentType')
                      this.setState({
                        morePaymentMethods: false,
                      })
                    } }
                  >
                    <span className="payment-type-text">Rooms To Go Finance</span>
                  </button>
                  <button
                    className={ classNames('payment-type cell small-4', {
                      active: morePaymentMethods,
                      disabled: hideMore,
                    }) }
                    role="tab"
                    id="tab3"
                    tabIndex={ morePaymentMethods ? 0 : -1 }
                    aria-selected={ morePaymentMethods }
                    aria-controls="panel3"
                    data-tip="React-tooltip"
                    data-tip-disable={ !hideMore }
                    onClick={ () => {
                      if (!hideMore) {
                        if (order.paymentInfo.filter(payment => payment.paymentType === 'VISA').length) {
                          setOrderInfo('Visa Checkout', 'selectedPaymentType')
                        } else if (order.paymentInfo.filter(payment => payment.paymentType === 'AFF').length) {
                          setOrderInfo('Affirm', 'selectedPaymentType')
                        } else {
                          setOrderInfo('PayPal', 'selectedPaymentType')
                        }
                      }
                    } }
                  >
                    <span className="payment-type-text">Other Payment Options</span>
                  </button>
                  <ReactToolTip place="top" type="dark" effect="float">
                    Must remove financing to use another payment method.
                  </ReactToolTip>
                </div>
              ) }

              <div id="panel1" role="tabpanel" tabIndex="0" className="credit-card-container">
                { showPaymentMethods && (
                  <>
                    { order.selectedPaymentType === 'Credit' && !morePaymentMethods && (
                      <div
                        className={ classNames('billing-iframe', {
                          accepted: decision,
                        }) }
                      >
                        <BillingAddress order={ order } />
                        <CreditCardMicroform order={ order } />
                      </div>
                    ) }
                  </>
                ) }
              </div>

              <div id="panel2" role="tabpanel" tabIndex="0" className="rooms-to-go-credit-container">
                { showPaymentMethods && order.selectedPaymentType === 'Rooms To Go' && <RoomsToGoCredit order={ order } /> }
              </div>

              <div id="panel3" role="tabpanel" tabIndex="0" className="grid-x more-payments">
                { showPaymentMethods && morePaymentMethods && (
                  <>
                    <div
                      className={ classNames('more-payment-type payment-type-image small-6 medium-3 large-3', {
                        active: order.selectedPaymentType === 'PayPal',
                      }) }
                      onClick={ () => setOrderInfo('PayPal', 'selectedPaymentType') }
                    >
                      <img
                        src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                        alt="PayPal Logo"
                      />
                      <div className="help-link">
                        <a
                          href="https://www.paypal.com/webapps/mpp/paypal-popup"
                          title="What is PayPal?"
                          target="_blank"
                        >
                          What is PayPal?
                        </a>
                      </div>
                    </div>
                    <div
                      className={ classNames('more-payment-type payment-type-image small-6 medium-3 large-3', {
                        active: order.selectedPaymentType === 'Visa Checkout',
                      }) }
                      onClick={ () => setOrderInfo('Visa Checkout', 'selectedPaymentType') }
                    >
                      <img
                        alt="Visa Checkout"
                        src="https://assets.secure.checkout.visa.com/VCO/images/acc_99x34_blu01.png"
                      />
                      <div className="help-link">
                        <a className="v-learn" title="Learn More">
                          Learn More
                        </a>
                      </div>
                    </div>
                    <div
                      className={ classNames('more-payment-type small-6 medium-3 large-3', {
                        active: order.selectedPaymentType === 'Affirm',
                        'affirm-disabled': !affirmAllowed,
                      }) }
                      aria-label={ !affirmAllowed ? 'Not allowed to use Affirm for financing down payment.' : 'Use Affirm' }
                      data-tip
                      data-tip-disable={ affirmAllowed }
                      data-for="Affirm"
                      onClick={ () => affirmAllowed && setOrderInfo('Affirm', 'selectedPaymentType') }
                    >
                      <img
                        className="affirm-logo"
                        alt="Affirm Logo"
                        src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzEuNjQgMTY2LjA0Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzJiYzJkZjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmxvZ290eXBlX2JsdWU8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI5OC4zOSwwQTE3LjU3LDE3LjU3LDAsMSwwLDMxNiwxNy41NywxNy41OSwxNy41OSwwLDAsMCwyOTguMzksMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjI4My4zIiB5PSI0Ni42OCIgd2lkdGg9IjI5Ljk5IiBoZWlnaHQ9IjExOS4zMSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQwMy40Nyw0My42MWMtMTUsMC0zMi4yNSwxMC44LTM3LjkzLDI0LjM0VjQ2LjY4SDMzNy4wOVYxNjZoMzBWMTEwLjU5YzAtMjMuNDUsOS0zNi41NCwyOC42MS0zNi45MUw0MTIuNDQsNDQuM0E2NC4xNyw2NC4xNywwLDAsMCw0MDMuNDcsNDMuNjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTI0LDQzLjY5Yy0xMi44NywwLTI0LjQxLDQuODQtMzIuNSwxMy42MmwtMC40Mi40NS0wLjQxLS40NWMtOC04Ljc4LTE5LjQ4LTEzLjYyLTMyLjM2LTEzLjYyLTI3LjU4LDAtNDcuNiwyMC4xMS00Ny42LDQ3LjgxVjE2NmgyOS41MlY5MC44NmMwLTExLjYzLDcuMS0xOS4xNCwxOC4wOC0xOS4xNHMxOC4wOSw3LjUxLDE4LjA5LDE5LjE0VjE2Nkg1MDZWOTAuODZjMC0xMS42Myw3LjEtMTkuMTQsMTguMDktMTkuMTRzMTguMDksNy41MSwxOC4wOSwxOS4xNFYxNjZoMjkuNTFWOTEuNUM1NzEuNjQsNjMuOCw1NTEuNjIsNDMuNjksNTI0LDQzLjY5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI0NywzNS42OWMwLTMuOTQuNTMtOC42NSwzLjktMTEuMjQsMy42OS0yLjg3LDkuMDktMi4zNCwxMy40Ni0yLjEybDUuODItMjEuNzItMy4xMS0uMTZjLTEyLjUyLS42Ny0yNS42OS0xLjYtMzYuNjcsNS42Ni05LjMxLDYuMTUtMTMuNDUsMTYuNzQtMTMuNDUsMjcuNjF2MTNIMTgxLjE4di0xMWMwLTMuOTIuNTItOC41OCwzLjgyLTExLjIsMy42OS0yLjkzLDkuMTYtMi4zOCwxMy41My0yLjE2bDUuODItMjEuNzItMy4xMS0uMTZjLTEyLjYyLS42OC0yNS45Mi0xLjYtMzYuOTEsNS44Ni05LjEyLDYuMTgtMTMuMTYsMTYuNjgtMTMuMTYsMjcuNDJ2MTNIMTM3LjY1VjY4LjM3aDEzLjUzVjE2NmgzMFY2OC4zN2gzNS43NlYxNjZoMzBWNjguMzdoMjAuNzdWNDYuNjhIMjQ3di0xMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMjIuNDMsMTY2bDAtMTA1LjM2YTE3LjMyLDE3LjMyLDAsMCwwLTE1LjMyLTE3Yy01LjczLS4zNy0xMS44MiwxLjczLTE1LjQxLDYuMzhMMCwxNjZIMjIuNmM5LDAsMTYuMTgtNC42OSwyMS42MS0xMS43TDk1LDkwLjA3VjE2NmgyNy40NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiLz48L3N2Zz4="
                      />

                      <div className="help-link">
                        <a
                          title="What is Affirm?"
                          target="_blank"
                          href="https://www.affirm.com/help/get-started/what-is-affirm"
                        >
                          What is Affirm?
                        </a>
                      </div>
                    </div>
                    <ReactToolTip id="Affirm" place="top" type="dark" effect="float">
                      Can't use Affirm to submit a down payment.
                    </ReactToolTip>
                    { /* { isSafari && (
                      <div
                        className={ classNames('more-payment-type small-12 medium-3 large-3', {
                          active: order.selectedPaymentType === 'ApplePay',
                        }) }
                        onClick={ () => setOrderInfo('ApplyPay', 'selectedPaymentType') }
                      >
                        <p className="payment-type-text">ApplePay</p>
                      </div>
                    ) } */ }
                  </>
                ) }
              </div>
            </div>
          </div>
        ) }
      </>
    )
  }
}
