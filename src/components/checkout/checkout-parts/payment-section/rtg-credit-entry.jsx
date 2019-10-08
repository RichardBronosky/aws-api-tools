import React from 'react'
import CheckoutInput from '../checkout-input'
import CheckoutErrorMessage from '../checkout-error-message'
import { validateRTGCreditInfo } from '../../../../lib/helpers/checkout/payment-section/rtg-finance'
import { months } from '../../../../lib/helpers/string-helper'
import RTGCreditModal from './rtg-credit-modal'
import loaderLight from '../../../../assets/images/loader-light.svg'
import '../../../../assets/css/components/checkout/checkout-parts/payment-section/rtg-credit-entry.sass'

export default class RTGCreditEntry extends React.Component {
  state = {
    promoModalOpen: false,
    termsModalOpen: false,
    loading: false,
    rtgCreditInfo: {
      name: '',
      cardNumber: '',
      zip: '',
      acknowledge: false,
      terms: false,
    },
    invalidFields: [],
    errorMsg: '',
    success: false,
  }

  setRTGCreditState = (info, field, callback = null) => {
    if (field) {
      this.setState(
        {
          ...this.state,
          [field]: info,
        },
        callback
      )
    } else {
      this.setState(
        {
          ...this.state,
          ...info,
        },
        callback
      )
    }
  }

  setRTGCreditInfo = (info, field) => {
    this.setState({
      rtgCreditInfo: {
        ...this.state.rtgCreditInfo,
        [field]: info,
      },
    })
  }

  closeModal = () => {
    this.setState({ promoModalOpen: false, termsModalOpen: false })
  }

  render() {
    const { financePlan } = this.props
    const { rtgCreditInfo, invalidFields, errorMsg, loading } = this.state
    let exceedsErr
    if (invalidFields && invalidFields.length > 0 && invalidFields[0].includes('exceeds')) {
      const arr = invalidFields[0].split(' ')
      exceedsErr = `Your order total exceeds your financing limit of $${ arr[arr.length - 1] }.`
    }
    return (
      <div className="step-container">
        <p className="bold margin">{ financePlan.siteFriendlyLabel }</p>
        <button className="link no-margin" onClick={ () => this.setState({ promoModalOpen: true }) }>
          Promotion Details >
        </button>
        { this.state.promoModalOpen && (
          <RTGCreditModal
            modalOpen={ this.state.promoModalOpen }
            closeModal={ this.closeModal }
            promoMessage={ financePlan.promoMessage }
          />
        ) }
        <div className="rtg-input-container">
          { invalidFields.filter(key => key !== 'acknowledge' && key !== 'terms').length > 0 && (
            <>
              { ' ' }
              <CheckoutErrorMessage
                invalidFields={ invalidFields.filter(key => key !== 'acknowledge' && key !== 'terms') }
                customMessage={ exceedsErr ? exceedsErr : errorMsg }
              />
              <br />
            </>
          ) }
          { (invalidFields.includes('terms') || invalidFields.includes('acknowledge')) && (
            <>
              <p className="invalid">*You must accept the terms and conditions before continuing.</p>
              <br />
              <br />
            </>
          ) }
          <CheckoutInput
            type="text"
            field="name"
            className="rtg-credit"
            label="Name on Rooms To Go Credit Card"
            aria-label="Name on Rooms To Go Credit Card"
            info={ rtgCreditInfo }
            setInfo={ this.setRTGCreditInfo }
            invalidFields={ invalidFields }
            required
          />
          <br />
          <CheckoutInput
            type="text"
            field="cardNumber"
            className="rtg-credit"
            label="Rooms To Go Credit Card Number"
            aria-label="Rooms To Go Credit Card Number"
            info={ rtgCreditInfo }
            setInfo={ this.setRTGCreditInfo }
            invalidFields={ invalidFields }
            required
          />
          <br />
          <CheckoutInput
            type="text"
            field="zip"
            className="rtg-zip"
            label="Billing Zip Code"
            aria-label="Billing Zip Code"
            info={ rtgCreditInfo }
            setInfo={ this.setRTGCreditInfo }
            invalidFields={ invalidFields }
            required
          />
        </div>
        <div className="checkbox-container">
          <CheckoutInput
            type="checkbox"
            field="acknowledge"
            aria-label="Understand I will be making equal monthly payments"
            info={ rtgCreditInfo }
            setInfo={ this.setRTGCreditInfo }
            afterComponent={ <div className="text-container">
                <p className="accept-text">
                  { !financePlan.downPaymentRequired
                    ? 'I acknowledge that by checking the E-Sign Consent box, I am indicating my my intent to sign this and to electronically accept my Synchrony Bank Account and Promotional Terms.'
                    : 'I understand that I will be making equal monthly payments and that paying with a Rooms To Go Credit Card requires a down payment equal to sales tax and delivery.' }
                </p>
              </div> }
          />
        </div>
        <div className="checkbox-container">
          <CheckoutInput
            type="checkbox"
            field="terms"
            aria-label="Accept terms and conditions"
            info={ rtgCreditInfo }
            setInfo={ this.setRTGCreditInfo }
            afterComponent={ <div className="text-container">
                <p className="accept-text">By checking this box, I acknowledge that I have read and agree to the</p>
                <button className="link" onClick={ () => this.setState({ termsModalOpen: true }) }>
                  Terms and Conditions
                </button>
                { this.state.termsModalOpen && (
                  <RTGCreditModal
                    modalOpen={ this.state.termsModalOpen }
                    closeModal={ this.closeModal }
                    promoMessage={ financePlan.termsAndConditions }
                  />
                ) }
                .
              </div> }
          />
        </div>
        <div className="submit-btn-container">
          <button
            className="submit-rtg-btn"
            value="Submit"
            onClick={ async e => {
              if (!loading) {
                await validateRTGCreditInfo(e, financePlan, rtgCreditInfo, this.setRTGCreditState)
              }
            } }
          >
            { !loading && 'Submit' }
            { loading && <img className="loader" alt="Submitting rooms to go credit card" src={ loaderLight } /> }
          </button>
        </div>
      </div>
    )
  }
}
