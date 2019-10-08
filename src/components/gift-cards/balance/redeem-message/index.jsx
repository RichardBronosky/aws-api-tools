import React from 'react'
import RTGLink from '@shared/link'
import './redeem-message.sass'

export default () => (
  <div className="redeem-message">
    <RTGLink
      className="small-12 period"
      aria-describedby="purchase-gift-card"
      data={ {
        slug: '/gift-cards/purchase',
        category: 'gift card',
        action: 'click',
        label: 'purchase gift card',
        text: 'Purchase Gift Card ',
      } }
    />
    <span>
      Redeem your Gift Card
      <RTGLink
        className="small-12"
        aria-describedby="redeem-gift-card-online"
        data={ {
          slug: '/',
          category: 'gift card',
          action: 'click',
          label: 'online',
          text: ' online ',
        } }
      />
      or in your nearest
      <RTGLink
        className="small-12 period"
        aria-describedby="redeem-gift-card-in-showroom"
        data={ {
          slug: '/stores',
          category: 'gift card',
          action: 'click',
          label: 'showroom',
          text: ' showroom',
        } }
      />
      .
    </span>
  </div>
)
