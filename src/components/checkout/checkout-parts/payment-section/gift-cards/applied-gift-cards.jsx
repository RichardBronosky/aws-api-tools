import React from 'react'
import { currencyFormatUS } from '../../../../../lib/helpers/string-helper'
import { onAddAnotherCard, onRemoveGiftCard } from '../../../../../lib/helpers/checkout/payment-section/gift-cards'
import loaderLight from '../../../../../assets/images/loader-light.svg'

export default ({ giftCards, order, setGiftCardState, removing }) => (
  <div className="grid-x">
    <div className="applied-gift-cards small-12">
      <h4>Applied Gift Cards</h4>
      <div className="grid-x">
        { giftCards.map(giftCard => (
          <div key={ giftCard.giftCardNumber } className="small-12 medium-7 large-6 applied-gift-card-container">
            <div className="applied-gift-card card">
              <button
                className="remove-card"
                tabIndex="0"
                value="Remove Gift Card"
                aria-label="Remove Gift Card"
                onClick={ () => onRemoveGiftCard(order, giftCard, setGiftCardState) }
              >
                { !removing && (
                  <img
                    className="icon close"
                    alt="close icon"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
                  />
                ) }
                { removing && <img className="loader" alt="Removing gift card" src={ loaderLight } /> }
              </button>
              <div className="gift-card-info">
                <p className="bold left">Gift Card</p>
                <p className="number">- { giftCard.giftCardNumber }</p>
                <br />
                Will use
                <p className="bold">
                  { currencyFormatUS(giftCard.authorizedAmount ? giftCard.authorizedAmount : giftCard.balance) }
                </p>
                of your <br />
                <p className="bold left">{ currencyFormatUS(giftCard.balance) }</p>
                balance
              </div>
            </div>
          </div>
        )) }
      </div>
      { !order.giftCardInfo.addAnotherCard && order && order.amountDue > 0 && (
        <button
          className="add-another-card"
          tabIndex="0"
          value="Remove Gift Card"
          aria-label="Remove Gift Card"
          onClick={ () => onAddAnotherCard(order) }
        >
          Add Another Gift Card
        </button>
      ) }
    </div>
  </div>
)
