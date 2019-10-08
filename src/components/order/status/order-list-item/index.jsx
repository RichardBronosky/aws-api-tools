import React from 'react'
import { getDateCalendarFormat } from '@helpers/date'
import { currencyFormatUS } from '@helpers/string-helper'
import { viewOrderDetails } from '../order-status-helper'
import './order-list-item.sass'

export default ({ order, setOrderStatusState }) => (
  <>
    { order && (
      <div className="grid-x cell small-12 order-status-order-group" key={ order.OrderNumber }>
        <div className="mobile left small-6"> Order Number: </div>
        <div className="order-status-order cell small-6 large-2"> { order.OrderNumber }</div>
        <div className="mobile small-6 left"> Order Placed: </div>
        <div className="order-status-order cell small-6 large-2"> { getDateCalendarFormat(order.OrderDate) }</div>
        <div className="mobile small-6 left">Total: </div>
        <div className="order-status-order cell small-6 large-2"> { currencyFormatUS(order.OrderTotal) }</div>
        <div className="mobile small-6 left">Balance: </div>
        <div className="order-status-order cell small-6 large-2"> { currencyFormatUS(order.Balance) }</div>
        <div className="mobile small-6 left">Status: </div>
        <div className="order-status-order cell small-6 large-2"> { order.Status }</div>
        <div className="order-status-order cell small-12 large-2">
          <button className="primary" onClick={ () => viewOrderDetails(order, setOrderStatusState) }>
            View Details
          </button>
        </div>
      </div>
    ) }
  </>
)
