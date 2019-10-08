import React from 'react'
import GiftCards from './gift-cards'
import { getGiftCards } from '../../../../../lib/helpers/checkout/payment-section/gift-cards'

export default class GiftCardsWrapper extends React.Component {
  state = {
    unableToAddMessage: '',
    loading: false,
    invalidFields: [],
    removing: false,
  }

  setGiftCardState = (info, field, callback = null) => {
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

  render() {
    const { order } = this.props
    const { removing, loading, invalidFields, unableToAddMessage } = this.state
    let paymentProperties = false
    if (order && order.paymentInfo && order.paymentInfo.length > 0) {
      paymentProperties = true
    }
    const giftCards = getGiftCards()
    return (
      <GiftCards
        order={ order }
        removing={ removing }
        loading={ loading }
        invalidFields={ invalidFields }
        giftCards={ giftCards }
        paymentProperties={ paymentProperties }
        setGiftCardState={ this.setGiftCardState }
        unableToAddMessage={ unableToAddMessage }
      />
    )
  }
}
