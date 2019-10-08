import React from 'react'
import DeliveryProduct from './delivery-product'
import '../../../../assets/css/components/checkout/checkout-parts/delivery-section/delivery-product.sass'
import ShippingBox from '../../../../assets/images/free-shipping-box.png'

export default ({ deliveryItems, ups, cart, usps }) => (
  <form className="delivery-form grid-x">
    <h3 className="small-12">{ `Shipped to your door${ ups ? ' via UPS' : usps ? ' via USPS' : '' }` }</h3>
    <h4 className="small-12">
      <img className="icon shipping-box" src={ ShippingBox } alt="" aria-hidden="true" role="presentation" />
      <p className="bold">FREE</p>
      <p>{ `${ ups ? 'ships via UPS' : usps ? 'ships via USPS' : 'shipping directly from vendor' }` }</p>
    </h4>
    <div className="delivery-product-container no-border small-12 medium-9 large-7">
      { deliveryItems.map((item, index) => {
        const itemInCart =
          cart &&
          cart.cartItems &&
          cart.cartItems.length > 0 &&
          cart.cartItems.filter(cartItem => cartItem.sku === item.sku)[0]
        return (
          <DeliveryProduct
            key={ item.sku }
            product={ itemInCart ? itemInCart.product : item }
            productCount={ deliveryItems.length }
            quantity={ item.quantity }
            index={ index }
          />
        )
      }) }
    </div>
  </form>
)
