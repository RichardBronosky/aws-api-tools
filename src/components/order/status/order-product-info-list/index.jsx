import React from 'react'
import OrderProductInfoListItem from '../order-product-info-list-item'
import { currencyFormatUS } from '@helpers/string-helper'
import './order-product-info-list.sass'

export default ({ order }) => (
  <>
    { order && order.LineItems && (
      <div className="grid-x cell small-12 order-product-info-list">
        <div className="grid-x cell small-12 order-status-product-info-headings-main">
          <div className="order-status-heading cell small-12 medium-4 large-7">Product Information</div>
          <div className="order-status-heading cell small-12 medium-2 large-1">Qty.</div>
          <div className="order-status-heading cell small-12 medium-3 large-2">Price</div>
          <div className="order-status-heading cell small-12 medium-3 large-2">Subtotal</div>
        </div>
        <div className="grid-x cell small-12 order-status-product-info-items">
          { order.LineItems.LineItem.map(product => (
            <OrderProductInfoListItem product={ product } key={ product.Sku } />
          )) }
        </div>
        <div className="order-status-product-info-totals grid-x cell small-12">
          <div className="grid-x cell small-12">
            <div className="order-status-heading cell large-8"></div>
            <div className="order-status-heading cell small-9 large-2">Sub Total</div>
            <div className="order-status-heading cell small-3 large-2">
              { currencyFormatUS(order.OrderTotal - order.DeliveryCharge) }
            </div>
          </div>
          <div className="grid-x cell small-12">
            <div className="order-status-heading cell large-8"></div>
            <div className="order-status-heading cell small-9 large-2">Delivery & Shipping</div>
            <div className="order-status-heading cell small-3 large-2">{ currencyFormatUS(order.DeliveryCharge) }</div>
          </div>
          <div className="grid-x cell small-12">
            <div className="order-status-heading cell large-8"></div>
            <div className="order-status-heading cell small-9 large-2">Tax</div>
            <div className="order-status-heading cell small-3 large-2">{ currencyFormatUS(order.TaxAmount) }</div>
          </div>
          <div className="grid-x cell small-12">
            <div className="order-status-heading cell large-8"></div>
            <div className="order-status-heading cell small-9 large-2">Total</div>
            <div className="order-status-heading cell small-3 large-2">{ currencyFormatUS(order.OrderTotal) }</div>
          </div>
          <div className="grid-x cell small-12 balance">
            <div className="cell large-8"></div>
            <div className="order-status-heading cell small-9 large-2">
              <strong>Balance:</strong>
            </div>
            <div className="order-status-heading cell small-3 large-2">
              <strong>{ currencyFormatUS(order.Balance) }</strong>
            </div>
          </div>
        </div>
      </div>
    ) }
  </>
)
