import React from 'react'
import Helmet from 'react-helmet'
import { store } from '../../../../redux/store'
import classNames from 'classnames'
import scriptLoader from 'react-async-script-loader'
import { setOrder } from '../../../../redux/modules/checkout'
import { getToken, updatePayment } from '../../../../lib/services/checkout'
import { reportToSentry } from '../../../../lib/helpers/checkout/global'
import { getCreditCardDecision } from '../../../../lib/helpers/checkout/payment-section/credit-card'
import '../../../../assets/css/components/checkout/checkout-parts/payment-section/credit-card-microform.sass'
import { setCheckoutStep } from '../../../../lib/helpers/checkout/global'
import paymentLogos from '../../../../assets/images/paymentLogosCondensed.png'

class CreditCardMicroform extends React.Component {
  state = {
    complete: false,
    errorMessage: null,
    inputError: false,
    microformIsLoading: false,
    didCreateMicroform: false,
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    const complete = getCreditCardDecision()
    if (complete) {
      this.setState({ complete })
    } else {
      if (isScriptLoaded) {
        if (isScriptLoadSucceed) {
          this.setupMicroform()
        } else {
          this.onError('Something went wrong. Please ', 'microform script', 'Could not load microform script')
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { complete, errorMessage, microformIsLoading } = this.state
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    const newComplete = getCreditCardDecision()
    if (!newComplete && this.state.complete) {
      this.setState({ complete: false }, this.setupMicroform)
    }
    if (!isScriptLoaded && !microformIsLoading) {
      this.setState({ microformIsLoading: true })
    }
    if (isScriptLoaded && !prevProps.isScriptLoaded && !complete && !errorMessage) {
      if (isScriptLoadSucceed) {
        this.setupMicroform()
      } else {
        this.onError('Something went wrong. Please ', 'microform script', 'Could not load microform script')
      }
    }
  }

  setupMicroform() {
    const { order } = this.props
    if (!this.state.didCreateMicroform) {
      this.setState({ microformIsLoading: true })
      getToken({ orderId: order.orderId })
        .then(res => {
          if (res.cybersourceToken) {
            const submitCardBtn = document.querySelector('#submit-card-btn')
            window.FLEX.microform(
              {
                keyId: res.cybersourceToken.kid,
                keystore: res.cybersourceToken,
                container: '#cardNumber-container',
                label: '#cardNumber-label',
                placeholder: '',
                styles: {
                  input: {
                    'font-size': '14px',
                    color: '#555',
                  },
                  ':disabled': { cursor: 'not-allowed' },
                  valid: { color: '#3c763d' },
                  invalid: { color: '#a94442' },
                },
                encryptionType: 'rsaoaep',
              },
              (setupError, microformInstance) => {
                if (setupError) {
                  this.onError(
                    'Something went wrong. Please ',
                    'microform creation',
                    'Could not create microform with provided token',
                    setupError
                  )
                  return
                }
                this.setState({ microformIsLoading: false, didCreateMicroform: true })
                submitCardBtn.addEventListener('click', () => this.onSubmitCard(microformInstance))
                setTimeout(
                  () => this.onError('Your session timed out. Please '),
                  900000
                ) /* Token will timeout after 15 mins */
              }
            )
          } else {
            this.onError('Something went wrong. Please ', 'microform token', 'No microform token provided')
          }
        })
        .catch(err => {
          this.onError('Something went wrong. Please ', 'microform token fetch', 'Could not fetch microform token', err)
        })
    }
  }

  newCard() {
    const order = this.props.order
    if (order && order.paymentInfo) {
      const paymentInfo = order.paymentInfo.filter(payment => payment.paymentType !== 'CYBERV2')
      const newOrder = {
        ...order,
        paymentInfo: paymentInfo.length > 0 ? paymentInfo : null,
      }
      if (newOrder.paymentInfo === null) {
        updatePayment({
          orderId: order.orderId,
          paymentInfo: [],
        }).then(data => {
          store.dispatch(setOrder(data))
          window.location.reload()
        })
        this.onError(
          'Something went wrong. Please ',
          'microform updatePayment',
          'error when calling updatePayment when selecting new card'
        )
      } else {
        store.dispatch(setOrder(newOrder))
        this.tryAgain()
      }
    }
  }

  tryAgain() {
    window.location.reload()
  }

  onSubmitCard(microformInstance) {
    const { order } = this.props
    this.setState({ inputError: false, microformIsLoading: true })
    const cardExpirationMonth = document.querySelector('#cardExpirationMonth')
    const cardExpirationYear = document.querySelector('#cardExpirationYear')
    const options = {
      cardExpirationMonth: cardExpirationMonth.value,
      cardExpirationYear: cardExpirationYear.value,
    }

    microformInstance.createToken(options, (err, mfResponse) => {
      if (err) {
        this.setState({ inputError: true, microformIsLoading: false })
        return
      }
      const creditCardPaymentInfo = {
        paymentType: 'CYBERV2',
        paymentProperties: {
          token: mfResponse,
        },
      }
      const paymentTypesToClear = ['AFF', 'VISA', 'PALV2', 'CYBERV2']
      const paymentInfo = order.paymentInfo.filter(payment => !paymentTypesToClear.includes(payment.paymentType))
      paymentInfo.push(creditCardPaymentInfo)
      updatePayment({
        orderId: order.orderId,
        paymentInfo,
      })
        .then(newOrder => {
          this.setState({ microformIsLoading: false })
          if (newOrder.paymentInfo) {
            store.dispatch(setOrder(newOrder))
            setCheckoutStep(null, 'payment', 'review')
          } else {
            this.onError('Something went wrong. Please ', 'microform updatePayment', 'No paymentInfo found')
          }
        })
        .catch(err => {
          this.onError(
            'Something went wrong. Please ',
            'microform updatePayment',
            'error when submitting credit card',
            err
          )
        })
    })
  }

  onError(errorMessage, errorTitle = null, errorDescription = null, errorData = null) {
    const { order } = this.props
    if (errorTitle && errorDescription) {
      reportToSentry(errorData, order, errorTitle, errorDescription)
    }
    this.setState({
      errorMessage,
      microformIsLoading: false,
      complete: false,
    })
  }

  renderMonthSelection() {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const monthOptions = months.map(month => (
      <option value={ month } key={ month }>
        { month }
      </option>
    ))
    return (
      <select id="cardExpirationMonth" name="ccmonth">
        { monthOptions }
      </select>
    )
  }

  renderYearSelection() {
    const currentYear = new Date().getFullYear()
    const yearOptions = new Array(20).fill(null).map((a, index) => {
      const newYear = currentYear + index
      return (
        <option value={ newYear } key={ newYear }>
          { newYear }
        </option>
      )
    })
    return (
      <select id="cardExpirationYear" name="ccyear">
        { yearOptions }
      </select>
    )
  }

  render() {
    const { complete, errorMessage, microformIsLoading, inputError } = this.state
    const shouldHideForm = complete || errorMessage || microformIsLoading
    return (
      <div>
        <div className="credit-card-microform-container">
          <div className={ classNames('microform-inner-container', { hidden: shouldHideForm }) }>
            <div className="microform-header">
              <span className="payment-header">Payment Details</span>
              <img
                className="paymentLogos"
                src={ paymentLogos }
                alt="Accepted payment types: Discover, Mastercard, Visa, Amex, Rooms to go Credit, PayPal, Affirm"
              />
            </div>
            <div className={ classNames('invalid-card', { hidden: !inputError }) }>
              Please input valid card information.
            </div>
            <div className="microform-form-container">
              <div className="card-input card-number">
                <label>Card Number*</label>
                <div id="cardNumber-container"></div>
              </div>
              <div className="card-input">
                <label>Expiration Month*</label>
                { this.renderMonthSelection() }
              </div>
              <div className="card-input">
                <label>Expiration Year*</label>
                { this.renderYearSelection() }
              </div>
            </div>
            <button id="submit-card-btn">Continue</button>
          </div>
          { microformIsLoading && !complete && !errorMessage && <div className="loading-icon" /> }
          { complete && !errorMessage && (
            <>
              <div className="success-icon">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <title>Credit card application was successful.</title>
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <span className="message">Credit card application was successful.</span>
              <button
                className="try-again"
                tabIndex="0"
                value="Enter new card"
                aria-label="Enter new card"
                onClick={ () => this.newCard() }
              >
                Enter new card
              </button>
            </>
          ) }
          { !complete && errorMessage && (
            <>
              <i className="error-icon icon close" aria-label="failed to apply credit card" />
              <div className="message">
                { errorMessage }
                <button
                  className="try-again"
                  tabIndex="0"
                  value="Refresh page"
                  aria-label="Refresh page"
                  onClick={ this.tryAgain }
                >
                  try again.
                </button>
              </div>
            </>
          ) }
        </div>
      </div>
    )
  }
}

export default scriptLoader([`https://flex.cybersource.com/cybersource/assets/microform/0.4.0/flex-microform.min.js`])(
  CreditCardMicroform
)
