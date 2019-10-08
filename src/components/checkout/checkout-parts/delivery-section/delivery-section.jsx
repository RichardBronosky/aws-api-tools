import React from 'react'
import { currencyFormatUS } from '../../../../lib/helpers/string-helper'
import { setDeliveryInfo, getDeliverySectionData } from '../../../../lib/helpers/checkout/delivery-section'
import CondensedInfo from './delivery-condensed'
import DeliveryModal from './delivery-modal'
import DeliveryProduct from './delivery-product'
import DeliveryTypeSection from './delivery-type-section'
import DistributionCenterPopup from './distribution-center-popup'
import ErrorMessage from '../checkout-error-message'
import '../../../../assets/css/components/checkout/checkout-parts/delivery-section/delivery-section.sass'

export default ({ order, checkoutStep, checkoutStepsCompleted, invalidFields, cart, deliveryCalendar }) => {
  const deliverySectionData = getDeliverySectionData(order, deliveryCalendar)
  const rtgDeliveryItems = deliverySectionData.rtgDeliveryItems
  const vendorDeliveryItems = deliverySectionData.vendorDeliveryItems
  const upsDeliveryItems = deliverySectionData.upsDeliveryItems
  const uspsDeliveryItems = deliverySectionData.uspsDeliveryItems
  const isExpress = deliverySectionData.isExpress
  const fullDeliveryDate = deliverySectionData.fullDeliveryDate
  const deliveryCondensed = checkoutStep !== 'delivery' && checkoutStepsCompleted.delivery
  return (
    <>
      { checkoutStep !== 'delivery' && deliveryCondensed && order && (
        <CondensedInfo
          deliveryDate={ fullDeliveryDate }
          order={ order }
          rtgDeliveryItems={ rtgDeliveryItems }
          vendorDeliveryItems={ vendorDeliveryItems }
          upsDeliveryItems={ upsDeliveryItems }
          uspsDeliveryItems={ uspsDeliveryItems }
          totalDeliveryCharge={ order.totalDeliveryCharge }
          isExpress={ isExpress }
          cart={ cart }
        />
      ) }
      { checkoutStep === 'delivery' && order && (
        <div className="delivery-section">
          { invalidFields.length > 0 && (
            <ErrorMessage
              invalidFields={ invalidFields }
              customMessage={ invalidFields.includes('payment incomplete')
                  ? 'You must complete delivery and payment before proceeding to review order.'
                  : 'There was an issue proceeding through checkout. Please refresh and try again.' }
            />
          ) }
          { rtgDeliveryItems.length > 0 && cart && cart.cartItems && cart.cartItems.length > 0 && (
            <form className="delivery-form grid-x">
              <h3 className="small-12">
                { ' ' }
                <img
                  className="icon shipping"
                  alt=""
                  className="icon shipping"
                  aria-hidden="true"
                  role="presentation"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
                <p className="professional-delivery-text">Professional Rooms To Go Delivery & Set-Up</p>
              </h3>
              <div className="delivery-product-container small-12 medium-9 large-7">
                { rtgDeliveryItems.map((item, index) => {
                  const itemInCart = cart.cartItems.filter(cartItem => cartItem.sku === item.sku)[0]
                  return (
                    <DeliveryProduct
                      key={ item.sku }
                      product={ itemInCart ? itemInCart.product : item }
                      productCount={ rtgDeliveryItems.length }
                      quantity={ item.quantity }
                      index={ index }
                      requiredAddon={ item.required }
                    />
                  )
                }) }
              </div>
              <div className="delivery-radio-container small-12 large-5">
                { !order.isPickup && (
                  <>
                    <p>Professional delivery & set-up to any room</p>
                    { !order.calendarType || (order.calendarType && order.calendarType !== 'weekly')
                      ? 'Delivered on: '
                      : 'Leaving our warehouse on: ' }
                    <p className="bold margin-left">{ fullDeliveryDate }</p>
                    <br />
                    <p className="bold margin-left">{ `${
                      isExpress ? 'Between 7AM - 10PM' : '4 hour delivery window'
                    }` }</p>
                    <br />
                  </>
                ) }
                { order.isPickup && (
                  <>
                    Pick-up from <DistributionCenterPopup /> { 'on: ' }
                    <p className="bold margin-left">{ fullDeliveryDate }</p>
                    <br />
                  </>
                ) }
                { order &&
                  order.lineItems &&
                  (deliveryCondensed || checkoutStep === 'delivery') &&
                  !order.isPickup &&
                  rtgDeliveryItems.length > 0 && (
                    <p className="automated-message desktop">
                      { isExpress
                        ? 'No advance call ahead.'
                        : order.calendarType && order.calendarType === 'weekly'
                        ? 'You will receive a call on the Thursday prior to the date that you selected. This call will identify the specific date and time that your merchandise will be delivered, within 12 days from the Monday you choose for your departure date.'
                        : 'Our automated system will call 2 days prior to notify you of the estimated delivery window.' }
                    </p>
                  ) }
                <p className="bold delivery-cost">
                  { `${ isExpress ? 'EXPRESS: ' : '' }${
                    !order.isPickup
                      ? `${ currencyFormatUS(order.totalDeliveryCharge ? order.totalDeliveryCharge : 0) } - `
                      : ''
                  }` }
                  <DeliveryModal />
                </p>
                { !order.isPickup && (
                  <>
                    <br />
                    <label htmlFor="tell us how to deliver" className="text-label">
                      Help us find your home (e.g. directions, gate code, etc.)
                    </label>
                    <textarea
                      type="text"
                      className="help-us"
                      name="tell us how to deliver"
                      aria-label="tell us how to deliver"
                      value={ order.additionalDirections }
                      maxLength="100"
                      onChange={ e => setDeliveryInfo(e.target.value, 'additionalDirections') }
                    />
                    <p className="char-limit">
                      { order.additionalDirections.length }
                      /100
                    </p>
                  </>
                ) }
              </div>
            </form>
          ) }
          { vendorDeliveryItems.length > 0 && <DeliveryTypeSection deliveryItems={ vendorDeliveryItems } cart={ cart } /> }
          { upsDeliveryItems.length > 0 && <DeliveryTypeSection deliveryItems={ upsDeliveryItems } cart={ cart } ups /> }
          { uspsDeliveryItems.length > 0 && <DeliveryTypeSection deliveryItems={ uspsDeliveryItems } cart={ cart } usps /> }
        </div>
      ) }
      { order && order.lineItems && deliveryCondensed && !order.isPickup && rtgDeliveryItems.length > 0 && (
        <p className="automated-message mobile">
          { isExpress
            ? '*No advance call ahead.'
            : order.calendarType && order.calendarType === 'weekly'
            ? '*You will receive a call on the Thursday prior to the date that you selected. This call will identify the specific date and time that your merchandise will be delivered, within 12 days from the Monday you choose for your departure date.'
            : '*Our automated system will call 2 days prior to notify you of the estimated delivery window.' }
        </p>
      ) }
    </>
  )
}
