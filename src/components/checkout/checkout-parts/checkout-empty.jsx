import React from 'react'
import RTGLink from '../../shared/link'
import '../../../assets/css/components/checkout/checkout-parts/checkout-empty.sass'

export default () => (
  <div className="checkout-empty small-12 large-9">
    <h1>CHECKOUT</h1>
    There are no items in your cart. You are unable to checkout.
    <RTGLink
      className="blue-action-btn"
      data={ {
        slug: '/',
        title: 'Continue Shopping',
        category: 'checkout-empty',
        action: 'click',
        label: 'continue shopping',
      } }
    >
      Continue Shopping
    </RTGLink>
  </div>
)
