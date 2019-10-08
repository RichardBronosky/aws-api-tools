import React from 'react'
import CheckoutErrorMessage from '../../checkout-error-message'
import GiftCardInputs from './gift-card-inputs'
import AppliedGiftCards from './applied-gift-cards'
import { onChangeUseGiftCard } from '../../../../../lib/helpers/checkout/payment-section/gift-cards'
import '../../../../../assets/css/components/checkout/checkout-parts/payment-section/gift-cards.sass'

export default ({
  order,
  removing,
  loading,
  invalidFields,
  giftCards,
  paymentProperties,
  setGiftCardState,
  unableToAddMessage,
}) => (
  <>
    { order && (
      <>
        <input
          type="checkbox"
          name="Use Gift Card"
          aria-label="Use Gift Card"
          checked={ order.giftCardInfo.useGiftCard }
          onChange={ e => onChangeUseGiftCard(order, e.target.checked) }
        />
        Use gift card
        <br />
        { order.giftCardInfo.useGiftCard && paymentProperties && (
          <p className="note">
            Note: Adding or removing gift cards may require you to re-enter other payment information below.
          </p>
        ) }
        { order.giftCardInfo.useGiftCard && invalidFields.length > 0 && (
          <>
            { ' ' }
            <CheckoutErrorMessage invalidFields={ invalidFields } />
          </>
        ) }
        { giftCards.length > 0 && order.giftCardInfo.useGiftCard && (
          <AppliedGiftCards
            order={ order }
            removing={ removing }
            giftCards={ giftCards }
            setGiftCardState={ setGiftCardState }
          />
        ) }
        { ((giftCards && giftCards.length < 1) || order.giftCardInfo.addAnotherCard) && (
          <>
            { order.giftCardInfo.useGiftCard && (
              <GiftCardInputs
                unableToAddMessage={ unableToAddMessage }
                order={ order }
                setGiftCardState={ setGiftCardState }
                invalidFields={ invalidFields }
                loading={ loading }
              />
            ) }
          </>
        ) }
      </>
    ) }
  </>
)
