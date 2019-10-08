import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import '../../assets/css/components/order/success.sass'
import { setupAnalytics } from '../../lib/helpers/google-tag-manager'
import { getOrder } from '../../lib/services/checkout'
import { getLastParamOfPath, currencyFormatUS } from '../../lib/helpers/string-helper'
import { fetchProductBySku } from '../../lib/services/product'
import { getRoomsToGoDeliveryItems, getOtherDeliveryItems } from '../../lib/helpers/cart'
import CondensedContact from '../../components/shared/condensed-contact-links'
import DeliveryProduct from '../../components/checkout/checkout-parts/delivery-section/delivery-product'
import Delivery from '../../components/order/delivery'
import ProductTile from '../../components/product/product-tile'
import SimpleSlider from '../../components/shared/slider'
import { productPrice, fetchProductOrGC } from '../../lib/helpers/product'

export default class OrderSuccess extends React.Component {
  state = {
    order: null,
  }

  componentDidMount() {
    setupAnalytics({ pageData: { type: 'order', title: 'Order Success', path: '/order-success' } })
    this.orderUpdate()
  }

  async orderUpdate() {
    getOrder({ orderId: getLastParamOfPath() }).then(order => {
      let cartItems = []
      const lineItems = order.lineItems && order.lineItems.filter(item => item.sku !== '99999925' && !item.required)
      lineItems.map(item => {
        cartItems.push(
          fetchProductOrGC(item.sku).then(product => {
            return {
              sku: product.sku,
              quantity: item.quantity,
              product: product,
              price: currencyFormatUS(productPrice(product)),
            }
          })
        )
      })
      Promise.all(cartItems).then(cartItems => {
        order['cartItems'] = cartItems
        order['rtgDeliveryItems'] = getRoomsToGoDeliveryItems(cartItems)
        order['otherDeliveryItems'] = getOtherDeliveryItems(cartItems)
        order['deliveryInfo'] = {
          dates: order.deliveryCalendar.map(date => {
            return { readable: '', date: date, isPickup: false, isStandardDelivery: true }
          }),
          deliveryDate: order.deliveryDate,
          pickup: false,
        }
        this.setState({
          order: order,
        })
      })
    })
  }

  render() {
    const { order } = this.state
    return (
      <Layout { ...this.props }>
        <Helmet title={ 'Order Successful - Rooms To Go' } />
        { order && (
          <div className="order-success grid-container">
            <div className="grid-x cell small-12">
              <div className="grid-x cell small-12 order-success-content">
                { order.cartItems && order.cartItems.length > 0 && (
                  <div className="grid-x grid-margin-y cell small-12">
                    <div className="grid-x grid-margin-y cell small-12 large-8">
                      <div className="cell small-12 large-12">
                        <h1>CONGRATULATIONS!</h1>
                        <h2>Your order is being processed.</h2>
                        <div className="confirmation-email">
                          { `A confirmation email will be sent to ${ order.contact.email }` }
                        </div>
                      </div>
                      <div className="grid-x cell small-12 order-success-product-totals card">
                        <div className="cell small-12 order-success-product">
                          <h3>Your Order</h3>
                          { order.cartItems.map(item => (
                            <DeliveryProduct
                              key={ item.product.sku }
                              product={ item.product }
                              quantity={ item.quantity }
                              index={ 1 }
                            />
                          )) }
                        </div>
                        <div className="cell small-12 large-6 order-success-totals right">
                          <ul>
                            <li>
                              <span className="">Sub-Total</span>
                              <span className="right bold">
                                { currencyFormatUS(order.total - order.tax - order.totalDeliveryCharge) }
                              </span>
                            </li>
                            <li>
                              <span className="">Shipping & Delivery</span>
                              <span className="right">{ currencyFormatUS(order.totalDeliveryCharge) }</span>
                            </li>
                            <li>
                              <span className="">Sales Tax</span>
                              <span className="right">{ currencyFormatUS(order.tax) }</span>
                            </li>
                            <hr />
                            <li>
                              <span className="bold">Total</span>
                              <span className="right bolder">{ currencyFormatUS(order.total) }</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="grid-x cell small-12 order-success-delivery card">
                        <div className="cell small-12">
                          <h3>Delivery</h3>
                          <Delivery
                            order={ order }
                            deliveryInfo={ order.deliveryInfo }
                            setDeliveryInfo={ this.setDeliveryInfo }
                            rtgDeliveryItems={ order.rtgDeliveryItems }
                            otherDeliveryItems={ order.otherDeliveryItems }
                            activeMenu={ '' }
                            completedCheckoutSteps={ 5 }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid-x grid-margin-y cell small-12 large-4 order-success-shipping-payment">
                      <div className="cell small-12 order-success-help-contact">
                        <div className="order-success-need-help">Need Help?</div>
                        <CondensedContact />
                      </div>
                      <div className="cell small-12 card order-success-shipping">
                        <h3>Shipping & Delivery Address</h3>
                        <div>{ `${ order.contact.firstName } ${ order.contact.lastName }` }</div>
                        <div>{ order.shippingAddress.address1 }</div>
                        <div>{ order.shippingAddress.address2 }</div>
                        <div>{ `${ order.shippingAddress.city }, ${ order.shippingAddress.state } ${ order.shippingAddress.zip }` }</div>
                        <br />
                        <div>{ order.contact.email }</div>
                        <div>{ order.contact.phone }</div>
                        { order.contact.altPhone && <div>{ `Alternate Phone: ${ order.contact.altPhone }` }</div> }
                      </div>
                      <div className="cell small-12 card order-success-payment">
                        <h3>Payment</h3>
                        <h4>Billing Information</h4>
                        { order.billingAddress && order.billingAddress.address1 && (
                          <>
                            { order.payer && <div>{ `${ order.payer.firstName } ${ order.payer.lastName }` }</div> }
                            { !order.payer && <div>{ `${ order.contact.firstName } ${ order.contact.lastName }` }</div> }
                            <div>{ order.billingAddress.address1 }</div>
                            <div>{ order.billingAddress.address2 }</div>
                            <div>{ `${ order.billingAddress.city }, ${ order.billingAddress.state } ${ order.billingAddress.zip }` }</div>
                            <br />
                          </>
                        ) }
                        { !order.billingAddress && order.shippingAddress && order.shippingAddress.address1 && (
                          <>
                            <div>{ `${ order.contact.firstName } ${ order.contact.lastName }` }</div>
                            <div>{ order.shippingAddress.address1 }</div>
                            <div>{ order.shippingAddress.address2 }</div>
                            <div>{ `${ order.shippingAddress.city }, ${ order.shippingAddress.state } ${ order.shippingAddress.zip }` }</div>
                            <br />
                          </>
                        ) }
                        { order.paymentInfo &&
                          order.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2').length > 0 && (
                            <div>Credit Card</div>
                          ) }
                        { order.paymentInfo &&
                          order.paymentInfo.filter(payment => payment.paymentType === 'FIN').length > 0 && (
                            <div>Rooms To Go Finance</div>
                          ) }
                        { order.paymentInfo &&
                          order.paymentInfo.filter(payment => payment.paymentType === 'GIFT').length > 0 && (
                            <div>Gift Card</div>
                          ) }
                        { order.paymentInfo &&
                          order.paymentInfo.filter(payment => payment.paymentType === 'PALV2').length > 0 && (
                            <div>PayPal</div>
                          ) }
                        { order.paymentInfo &&
                          order.paymentInfo.filter(payment => payment.paymentType === 'AFF').length > 0 && (
                            <div>Affirm</div>
                          ) }
                        { order.paymentInfo &&
                          order.paymentInfo.filter(payment => payment.paymentType === 'VISA').length > 0 && (
                            <div>Visa Checkout</div>
                          ) }
                      </div>
                    </div>
                  </div>
                ) }
              </div>
              { order.cartItems &&
                order.cartItems[0] &&
                order.cartItems[0].product &&
                order.cartItems[0].product.collection_items && (
                  <div className="cell small-12">
                    <SimpleSlider
                      data={ {
                        heading: 'YOU MAY ALSO LIKE',
                      } }
                      maxSlides={ 4 }
                    >
                      { order.cartItems[0].product.collection_items.map((product, index) => (
                        <ProductTile sku={ product.sku } key={ product.sku } viewType="grid" index={ index } />
                      )) }
                    </SimpleSlider>
                  </div>
                ) }
              <div className="cell small-12">
                <CondensedContact />
              </div>
            </div>
          </div>
        ) }
      </Layout>
    )
  }
}
