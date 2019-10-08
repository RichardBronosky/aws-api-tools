import React from 'react'
import classNames from 'classnames'
import CheckoutInput from '../../checkout-input'
import ErrorMessage from '../../checkout-error-message'
import AddressSuggestionModal from '../../address-suggestion-modal'
import { states } from '../../../../../lib/helpers/geo-location'
import { setPayerInfo } from '../../../../../lib/helpers/checkout/payment-section/payment-section'
import {
  setBillingAddressInfo,
  onBillingStateChange,
  onChangeBillingDifferent,
} from '../../../../../lib/helpers/checkout/payment-section/billing-address'
import '../../../../../assets/css/components/checkout/checkout-parts/payment-section/billing-address.sass'
import loaderLight from '../../../../../assets/images/loader-light.svg'

export default ({ order, invalidFields, loading, submitBillingAddress, clearInvalidFields, setBillingState }) => {
  const suggestModal = invalidFields.length === 1 && invalidFields.includes('unable to verify')
  return (
    <div className="billing-container">
      <input
        type="checkbox"
        className="billing-address-checkbox"
        name="Edit Billing Address"
        label="Edit Billing Address"
        aria-label="Edit Billing Address"
        checked={ !order.payer.billingDifferent }
        onChange={ e => onChangeBillingDifferent(e, order) }
      />
      Billing address same as shipping
      { order.payer.billingDifferent && !order.payer.billingSubmitted && (
        <div className="billing-address">
          { invalidFields.length > 0 && (
            <ErrorMessage
              invalidFields={ invalidFields }
              customMessage={ suggestModal ? 'We were unable to verify your address. Please review your entry and try again.' : null }
            />
          ) }
          { suggestModal && (
            <AddressSuggestionModal
              setBillingState={ setBillingState }
              modalOpen={ suggestModal }
              order={ order }
              suggestion={ order.suggestedAddress }
              closeModal={ clearInvalidFields }
            />
          ) }
          <CheckoutInput
            type="text"
            field="firstName"
            label="First Name"
            info={ order.payer }
            setInfo={ setPayerInfo }
            invalidFields={ invalidFields }
            required
          />
          <CheckoutInput
            type="text"
            field="lastName"
            label="Last Name"
            info={ order.payer }
            setInfo={ setPayerInfo }
            invalidFields={ invalidFields }
            required
          />
          <CheckoutInput
            type="text"
            className="street"
            field="address1"
            label="Street Address"
            info={ order.billingAddress }
            setInfo={ setBillingAddressInfo }
            invalidFields={ invalidFields }
            required
          />
          <CheckoutInput
            type="text"
            className="apt"
            field="address2"
            label="Apt, Suite, Etc"
            info={ order.billingAddress }
            setInfo={ setBillingAddressInfo }
          />
          <CheckoutInput
            type="text"
            className="city"
            field="city"
            label="City"
            info={ order.billingAddress }
            setInfo={ setBillingAddressInfo }
            invalidFields={ invalidFields }
            required
          />
          <label className="label state" htmlFor="state">
            <p>State*</p>
            <select
              name="state"
              aria-label="State*"
              className={ classNames('state', {
                invalid: invalidFields.includes('state'),
              }) }
              value={ order.billingAddress.state.toUpperCase() }
              onChange={ selected => onBillingStateChange(selected, setBillingAddressInfo) }
            >
              { (!order.billingAddress.state || order.billingAddress.state === '') && (
                <option value="none">*State</option>
              ) }
              { states
                .filter(state => state[1] !== 'PR')
                .map(state => (
                  <option key={ state[1] } value={ state[1] }>
                    { state[1] }
                  </option>
                )) }
            </select>
          </label>
          <CheckoutInput
            type="text"
            className="zip"
            field="zip"
            label="Zip"
            info={ order.billingAddress }
            setInfo={ setBillingAddressInfo }
            invalidFields={ invalidFields }
            required
          />
          <div className="submit-billing-container">
            <button
              className="submit-billing-btn"
              tabIndex="0"
              value="Submit"
              aria-label="Submit"
              onClick={ () => submitBillingAddress() }
            >
              { !loading && <>Submit</> }
              { loading && <img className="loader" alt="Submitting new billing address" src={ loaderLight } /> }
            </button>
          </div>
        </div>
      ) }
      { order.payer.billingDifferent && order.payer.billingSubmitted && (
        <div className="billing">
          <h4>Billing Information</h4>(
          <button
            className="edit-billing-btn"
            tabIndex="0"
            value="Edit Billing Address"
            aria-label="Edit Billing Address"
            onClick={ () => setPayerInfo(false, 'billingSubmitted') }
          >
            Edit Billing Address
          </button>
          )
          <div className="left-info">
            { order.payer.firstName + ' ' + order.payer.lastName }
            <br />
            { order.billingAddress.address1 }
            { order.billingAddress.address2 !== '' && ' ' + order.billingAddress.address2 }
            <br />
            { order.billingAddress.city + ' ' }
            { order.billingAddress.state + ' ' }
            { order.billingAddress.zip }
          </div>
        </div>
      ) }
    </div>
  )
}
