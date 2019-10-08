import React from 'react'
import RTGLink from '../../shared/link'
import '../../../assets/css/components/cart/cart-parts/cart-empty.sass'

export default () => (
  <div id="empty-cart-title" className="cart-empty small-12 large-9">
    There are no items in your cart.
    <RTGLink
      id="empty-cart-continue"
      className="blue-action-btn"
      aria-describedby="empty-cart-title"
      data={ {
        slug: '/',
        category: 'cart-empty',
        action: 'click',
        label: 'continue shopping',
      } }
    >
      Continue Shopping
    </RTGLink>
  </div>
)
