import React from 'react'
import classNames from 'classnames'
import ReactAutocomplete from 'react-autocomplete'
import { states } from '../../../../lib/helpers/geo-location'
import { onItemKeyDown, onInputBlur, onInputKeyDown } from '../../../../lib/helpers/input-helper'
import CheckoutInput from '../checkout-input'
import ErrorMessage from '../checkout-error-message'
import CondensedInfo from './shipping-condensed'
import AddressSuggestionModal from '../address-suggestion-modal'
import {
  setContactInfo,
  setShippingAddressInfo,
  setAddress,
  onAddressLookupChange,
  onAddressLookupSelect,
  onClickChangeAddress,
  onStateChange,
  onMenuVisibilityChange,
  addressItemsFocus,
  checkPlus4,
} from '../../../../lib/helpers/checkout/shipping-section'
import { setOrderInfo } from '../../../../lib/helpers/checkout/global'
import '../../../../assets/css/components/checkout/checkout-parts/shipping-section/shipping-section.sass'

export default class ShippingSection extends React.Component {
  state = {
    addressItems: [],
  }

  setAddressItems = items => {
    this.setState({
      addressItems: items,
    })
    addressItemsFocus(items, this._autocomplete)
  }

  render() {
    const { order, checkoutStep, invalidFields } = this.props
    const addressLookupParts = order.shippingAddress.addressLookup.split(',')
    checkPlus4(order)
    const suggestModal = invalidFields.includes('unable to verify')
    return (
      <>
        { checkoutStep !== 'shipping' && order.contact.firstName && <CondensedInfo order={ order } /> }
        { suggestModal && (
          <AddressSuggestionModal modalOpen={ suggestModal } order={ order } suggestion={ order.suggestedAddress } />
        ) }
        { checkoutStep === 'shipping' && (
          <form className="shipping-form">
            <p className="required-label">*Asterisks indicate required fields in the form below</p>
            { invalidFields.length > 0 && (
              <ErrorMessage
                invalidFields={ invalidFields }
                customMessage={ invalidFields.includes('unable to verify')
                    ? 'We were unable to verify your address. Please review your entry and try again.'
                    : invalidFields.includes('delivery incomplete')
                    ? 'You must complete shipping and delivery before proceeding to payment.'
                    : invalidFields.includes('payment incomplete')
                    ? 'You must complete shipping, delivery, and payment before proceeding to review order.'
                    : invalidFields.includes('buttonClick') &&
                      'There was an issue proceeding through checkout. Please refresh and try again.' }
              />
            ) }
            <CheckoutInput
              type="text"
              field="firstName"
              label="First Name"
              name="first name"
              info={ order.contact }
              setInfo={ setContactInfo }
              invalidFields={ invalidFields }
              required
            />
            <CheckoutInput
              type="text"
              field="lastName"
              label="Last Name"
              name="last name"
              info={ order.contact }
              setInfo={ setContactInfo }
              invalidFields={ invalidFields }
              required
            />
            <span id="addressInstructions" className="hide508">
              Start typing to receive address suggestions.
            </span>
            { order.shippingAddress.showAddressLookup && !order.shippingAddress.addressLookupSuccess && (
              <>
                <span id="addressInstructions" className="hide508">
                  Start typing to receive address suggestions.
                </span>
                <label htmlFor="address">
                  <span className="address-label">
                    Address<span className="hide508"> Lookup</span>*
                  </span>
                  <ReactAutocomplete
                    ref={ el => (this._autocomplete = el) }
                    items={ this.state.addressItems }
                    getItemValue={ item => item.label }
                    inputProps={ {
                      type: 'text',
                      name: 'address-lookup',
                      ['aria-haspopup']: 'listbox',
                      ['aria-autocomplete']: 'list',
                      ['aria-controls']: 'addressSuggest',
                      ['aria-activedescendant']: '',
                      ['aria-describedby']: 'addressInstructions',
                      ['aria-label']: 'Address Lookup',
                      ['aria-required']: true,
                      className: classNames('address-lookup-input', {
                        invalid: invalidFields.includes('addressLookup'),
                      }),
                      placeholder: 'Address Lookup*',
                      onKeyDown: e => onInputKeyDown(e, this._autocomplete),
                      onBlurCapture: e => onInputBlur(e),
                    } }
                    renderInput={ props => {
                      return <input { ...props } autoComplete="new-password" />
                    } }
                    onMenuVisibilityChange={ () => onMenuVisibilityChange(this.state.addressItems, this.setAddressItems) }
                    renderMenu={ children => (
                      <ul id="addressSuggest" role="listbox">
                        { children }
                      </ul>
                    ) }
                    renderItem={ item => (
                      <li
                        key={ item.id }
                        id={ item.id === 'no results' ? 'addsugnoresults' : 'addsug' + item.id }
                        className="address-list-item"
                        role="option"
                        tabIndex="0"
                        onKeyDown={ e => {
                          onItemKeyDown(e, this._autocomplete)
                        } }
                      >
                        { item.id === 'no results' && (
                          <>
                            { item.label }
                            <a
                              tabIndex="0"
                              role="button"
                              className={ classNames('address-manual-btn', { 'results-exist': item.label === '' }) }
                              onClick={ () => setAddress('No matches.') }
                            >
                              Enter address manually.
                            </a>
                          </>
                        ) }
                        { item.label !== 'No matches.' && <>{ item.label }</> }
                      </li>
                    ) }
                    value={ order.shippingAddress.addressLookup }
                    onChange={ e => {
                      onAddressLookupChange(e, this.setAddressItems)
                    } }
                    onSelect={ e => onAddressLookupSelect(e) }
                  />
                  <div className="manual-address">
                    <a tabIndex="0" role="button" onClick={ () => setShippingAddressInfo(false, 'showAddressLookup') }>
                      Enter address manually.
                    </a>
                  </div>
                </label>
              </>
            ) }
            { !order.shippingAddress.showAddressLookup && !order.shippingAddress.addressLookupSuccess && (
              <>
                <CheckoutInput
                  type="text"
                  className="street"
                  field="address1"
                  label="Street Address"
                  info={ order.shippingAddress }
                  setInfo={ setShippingAddressInfo }
                  invalidFields={ invalidFields }
                  required
                />
                <CheckoutInput
                  type="text"
                  className="apt"
                  field="address2"
                  label="Apt, Suite, Etc"
                  info={ order.shippingAddress }
                  setInfo={ setShippingAddressInfo }
                />
                <CheckoutInput
                  type="text"
                  className="city"
                  field="city"
                  label="City"
                  info={ order.shippingAddress }
                  setInfo={ setShippingAddressInfo }
                  invalidFields={ invalidFields }
                  required
                />

                <label className="label state" htmlFor="state">
                  State*
                  <select
                    name="state"
                    className={ classNames('state', {
                      invalid: invalidFields.includes('state'),
                    }) }
                    value={ order.shippingAddress.state.toUpperCase() }
                    onChange={ selected => onStateChange(selected) }
                  >
                    { (!order.shippingAddress.state || order.shippingAddress.state === '') && (
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
                  info={ order.shippingAddress }
                  setInfo={ setShippingAddressInfo }
                  invalidFields={ invalidFields }
                  required
                />
              </>
            ) }
            { order.shippingAddress.addressLookupSuccess && (
              <div className="address-selected card">
                <svg className="checkmark-add-to-cart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="checkmark-add-to-cart__circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-add-to-cart__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <p>{ addressLookupParts[0] }</p>
                <p>{ addressLookupParts[1] }</p>
                <button
                  value="Change Address"
                  name="change_address"
                  className="change-address-btn"
                  aria-label="Change Address"
                  onClick={ e => onClickChangeAddress(e) }
                >
                  Change
                </button>
              </div>
            ) }

            <CheckoutInput
              type="tel"
              field="phone"
              label="Phone Number"
              additional="Numbers and hyphens only"
              name="tel"
              info={ order.contact }
              setInfo={ setContactInfo }
              invalidFields={ invalidFields }
              required
            />

            <CheckoutInput
              type="tel"
              field="altPhone"
              label="Alternate Phone"
              name="alt tel"
              info={ order.contact }
              setInfo={ setContactInfo }
              invalidFields={ invalidFields }
            />

            <CheckoutInput
              type="email"
              field="email"
              label="Email"
              name="email"
              info={ order.contact }
              setInfo={ setContactInfo }
              invalidFields={ invalidFields }
              required
            />

            <fieldset className="text-me-container">
              <legend className="text-me-label">Text me delivery time frames</legend>
              <CheckoutInput
                type="radio"
                className="text-me"
                field="deliveryTexts"
                info={ order }
                setInfo={ setOrderInfo }
                name="text-me"
                afterComponent={ <span className="radio-label">Yes</span> }
                radioValue={ true }
              />
              <CheckoutInput
                type="radio"
                className="text-me"
                field="deliveryTexts"
                info={ order }
                setInfo={ setOrderInfo }
                name="text-me"
                afterComponent={ <span className="radio-label">No</span> }
                radioValue={ false }
              />
            </fieldset>
            <br />
            <div className="checkbox-container">
              <CheckoutInput
                type="checkbox"
                className="text-me"
                field="emailCampaign"
                label="Sign up for Rooms To Go email promotions and news letters"
                info={ order }
                setInfo={ setOrderInfo }
                afterComponent={ <p>Sign up for Rooms To Go email promotions and news letters</p> }
              />
            </div>
          </form>
        ) }
      </>
    )
  }
}
