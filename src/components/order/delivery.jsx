import React from 'react'
import '../../assets/css/components/order/delivery.sass'
import { currencyFormatUS } from '../../lib/helpers/string-helper'
import DeliveryProduct from '../checkout/checkout-parts/delivery-section/delivery-product'
import DistributionCenterPopup from '../checkout/checkout-parts/delivery-section/distribution-center-popup'
import { getDateFull } from '../../lib/helpers/date'

export default class OrderDelivery extends React.Component {
  render() {
    const { order } = this.props
    const allProduct = [...order.rtgDeliveryItems, ...order.otherDeliveryItems]
    const otherDeliveryItems =
      order.otherDeliveryItems && order.otherDeliveryItems.filter(item => item.product.delivery_type !== 'T')
    const giftCards =
      order.otherDeliveryItems && order.otherDeliveryItems.filter(item => item.product.delivery_type === 'T')
    const deliveryDate = getDateFull(new Date(order.deliveryDate))
    return (
      <div className="grid-x grid-padding-x grid-padding-y small-margin-collapse order-delivery-section">
        { order.isPickup && (
          <div className="cell small-12 delivery-form">
            <div className="cell small-12 delivery-heading">
              <h4>
                Pick-up from <DistributionCenterPopup order={ order } /> on: { deliveryDate }
              </h4>
            </div>
            <div className="delivery-product-container cell small-12">
              { allProduct.map((item, index) => (
                <DeliveryProduct
                  key={ item.product.sku }
                  product={ item.product }
                  productCount={ allProduct.length }
                  quantity={ item.quantity }
                  index={ index }
                  noImage
                />
              )) }
            </div>
          </div>
        ) }
        { !order.isPickup && order.rtgDeliveryItems.length > 0 && (
          <div className="cell small-12 medium-6 large-6 delivery-form">
            <div className="cell small-12 delivery-heading">
              <h4>
                <img
                  className="icon shipping"
                  alt=""
                  aria-hidden="true"
                  role="presentation"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
                Professional Rooms To Go Delivery & Set-Up
              </h4>
            </div>
            <div className="cell small-12 delivery-info">
              <div>
                Delivery On: <span className="bold">{ deliveryDate }</span>
              </div>
              <div className="bold">{ `${
                order.calendarType === 'weekly' ? '' : order.isExpress ? 'Between 7AM - 10PM' : '4 hour delivery window'
              }` }</div>
              <div className="bold">{ currencyFormatUS(order.totalDeliveryCharge) }</div>
              <div className="cell small-12 automated-message">
                { order.isExpress
                  ? 'No advance call ahead.'
                  : order.calendarType && order.calendarType === 'weekly'
                  ? 'You will receive a call on the Thursday prior to the date that you selected. This call will identify the specific date and time that your merchandise will be delivered, within 12 days from the Monday you choose for your departure date.'
                  : 'Our automated system will call 2 days prior to notify you of the estimated delivery window.' }
              </div>
            </div>
            <div className="delivery-product-container cell small-12">
              { order.rtgDeliveryItems.map((item, index) => (
                <DeliveryProduct
                  key={ item.product.sku }
                  product={ item.product }
                  productCount={ order.rtgDeliveryItems.length }
                  quantity={ item.quantity }
                  index={ index }
                  noImage
                />
              )) }
            </div>
          </div>
        ) }
        { !order.isPickup && otherDeliveryItems.length > 0 && (
          <div className="cell small-12 medium-6 large-6 delivery-form">
            <div className="cell small-12 delivery-heading">
              <h4>
                <img
                  className="icon shipping"
                  alt=""
                  aria-hidden="true"
                  role="presentation"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
                Shipped to your door
              </h4>
            </div>
            <div className="cell small-12 delivery-info">
              <span className="bold">FREE </span>
              <span>Shipping directly from vendor</span>
            </div>
            <div className="delivery-product-container no-border cell small-12">
              { otherDeliveryItems.map((item, index) => (
                <DeliveryProduct
                  key={ item.product.sku }
                  product={ item.product }
                  productCount={ order.otherDeliveryItems.length }
                  quantity={ item.quantity }
                  index={ index }
                  noImage
                />
              )) }
            </div>
          </div>
        ) }
        { !order.isPickup && giftCards.length > 0 && (
          <div className="cell small-12 medium-6 large-6 delivery-form">
            <div className="cell small-12 delivery-heading">
              <h4>
                <img
                  className="icon shipping"
                  alt=""
                  aria-hidden="true"
                  role="presentation"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
                Shipped to your door
              </h4>
            </div>
            <div className="cell small-12 delivery-info">
              <span className="bold">FREE </span>
              <span>Shipped via USPS</span>
            </div>
            <div className="delivery-product-container no-border cell small-12">
              { giftCards.map((item, index) => (
                <DeliveryProduct
                  key={ item.product.sku }
                  product={ item.product }
                  productCount={ order.otherDeliveryItems.length }
                  quantity={ item.quantity }
                  index={ index }
                  noImage
                />
              )) }
            </div>
          </div>
        ) }
        { !order.isPickup && order.calendarType === 'weekly' && (
          <div className="cell small-12 automated-message">
            *You will receive a call on the Thursday prior to the date that you selected. This call will identify the
            specific date and time that your merchandise will be delivered, within 12 days from the Monday you choose
            for your departure date.' : '*Our automated system will call 2 days prior to notify you of the estimated
            delivery window.
          </div>
        ) }
      </div>
    )
  }
}
