import React from 'react'
import DeliveryProduct from '../delivery-product'
import DistributionCenterPopup from '../distribution-center-popup'
import DeliveryTypeSection from './delivery-type-section'
import '../../../../../assets/css/components/checkout/checkout-parts/delivery-section/delivery-condensed.sass'

export default ({
  deliveryDate,
  order,
  rtgDeliveryItems,
  vendorDeliveryItems,
  upsDeliveryItems,
  uspsDeliveryItems,
  isExpress,
  cart,
}) => {
  return (
    <div className="delivery-condensed grid-x">
      { rtgDeliveryItems.length > 0 && (
        <div className="deliver-section small-12 large-5">
          <>
            { !order.isPickup && <h3>Professional Delivery from Rooms To Go</h3> }
            <h4 className="small-12">
              { !order.isPickup && (
                <>
                  <p className="bold">
                    *{ `${ isExpress ? 'EXPRESS: ' : '' }` }${ order.totalDeliveryCharge }
                  </p>
                  <p>estimated delivery: </p>
                  <p className="bold">{ deliveryDate }</p>
                </>
              ) }
              { order.isPickup && (
                <>
                  <div>
                    Pick-up from <DistributionCenterPopup /> on:
                  </div>
                  <p className="bold">{ deliveryDate }</p>
                </>
              ) }
            </h4>
            { cart &&
              cart.cartItems &&
              cart.cartItems.length > 0 &&
              rtgDeliveryItems.map((item, index) => {
                const itemInCart = cart.cartItems.filter(cartItem => cartItem.sku === item.sku)[0]
                return (
                  <DeliveryProduct
                    key={ item.sku }
                    product={ itemInCart ? itemInCart.product : item }
                    productCount={ rtgDeliveryItems.length }
                    quantity={ item.quantity }
                    index={ index }
                    requiredAddon={ item.required }
                    noImage
                  />
                )
              }) }
          </>
        </div>
      ) }
      { vendorDeliveryItems.length > 0 && (
        <DeliveryTypeSection deliveryItems={ vendorDeliveryItems } deliveryDate={ deliveryDate } cart={ cart } />
      ) }
      { upsDeliveryItems.length > 0 && (
        <DeliveryTypeSection deliveryItems={ upsDeliveryItems } deliveryDate={ deliveryDate } cart={ cart } ups />
      ) }
      { uspsDeliveryItems.length > 0 && (
        <DeliveryTypeSection deliveryItems={ uspsDeliveryItems } deliveryDate={ deliveryDate } cart={ cart } usps />
      ) }
      { (vendorDeliveryItems.length > 0 || upsDeliveryItems.length > 0) && order.additionalDirections !== '' && (
        <div className="provided-instructions-container small-12">
          <p className="provided-instructions bold">Provided Instructions:</p>
          <p className="provided-instructions">{ order.additionalDirections }</p>
        </div>
      ) }
    </div>
  )
}
