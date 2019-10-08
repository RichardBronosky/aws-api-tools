import React from 'react'
import classNames from 'classnames'
import { onApplyGiftCard, setOrderGiftCardInfo } from '../../../../../lib/helpers/checkout/payment-section/gift-cards'
import loaderLight from '../../../../../assets/images/loader-light.svg'

export default ({ unableToAddMessage, order, invalidFields, loading, setGiftCardState }) => (
  <div className="gift-card grid-x">
    <div className="small-12 medium-6">
      <label className="" htmlFor="giftCardNumber">
        { unableToAddMessage !== '' && <p className="error">*{ unableToAddMessage }</p> }
        <p>*Gift Card Number</p>
        <input
          type="text"
          className={ classNames('gift-card-number', {
            invalid: invalidFields.includes('giftCardNumber'),
          }) }
          placeholder="Gift Card Number"
          name="Gift Card Number"
          aria-label="Gift Card Number"
          value={ order.giftCardInfo.giftCardNumber }
          onChange={ e => setOrderGiftCardInfo(e.target.value, 'giftCardNumber') }
        />
      </label>
      <br />
      <label className="" htmlFor="giftCardPin">
        <p>*Pin</p>
        <input
          type="text"
          className={ classNames('gift-card-pin', {
            invalid: invalidFields.includes('giftCardPin'),
          }) }
          placeholder="Pin"
          name="Pin"
          aria-label="Pin"
          value={ order.giftCardInfo.giftCardPin }
          onChange={ e => setOrderGiftCardInfo(e.target.value, 'giftCardPin') }
        />
      </label>
      <br />
      <button
        className="apply-gift-card-btn small-12 medium-3"
        tabIndex="0"
        value="Apply Gift Card"
        aria-label="Apply Gift Card"
        onClick={ () => onApplyGiftCard(order, setGiftCardState) }
      >
        { !loading ? 'apply gift card' : <img className="loader" alt="Removing gift card" src={ loaderLight } /> }
      </button>
      { order.giftCardInfo.addAnotherCard && (
        <button
          className="apply-gift-card-btn cancel small-12 medium-1"
          tabIndex="0"
          value="Cancel"
          aria-label="Cancel"
          onClick={ () => setOrderGiftCardInfo(false, 'addAnotherCard') }
        >
          Cancel
        </button>
      ) }
    </div>
  </div>
)
