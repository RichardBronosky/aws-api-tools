import React from 'react'
import DeliveryProduct from '../delivery-product'

export default ({ deliveryItems, ups, cart, usps }) => (
  <>
    <div className="shipped-section small-12 large-5">
      <h3>{ `Shipped to Your Door ${ ups ? 'via UPS' : usps ? 'via USPS' : 'from Vendor' }` }</h3>
      <h4 className="small-12">
        <p className="bold">FREE</p>
        <p>{ `${ usps ? '' : 'Should arrive in 7-10 business days' }` }</p>
      </h4>
      { deliveryItems.map((item, index) => {
        const itemInCart = cart.cartItems.filter(cartItem => cartItem.sku === item.sku)[0]
        return (
          <DeliveryProduct
            key={ item.sku || item.product.sku }
            product={ itemInCart ? itemInCart.product : item }
            productCount={ deliveryItems.length }
            quantity={ item.quantity }
            index={ index }
            noImage
          />
        )
      }) }
    </div>
    <br />
  </>
)
