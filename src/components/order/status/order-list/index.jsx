import React from 'react'
import OrderListItem from '../order-list-item'
import './order-list.sass'

export default ({ orderList, heading, setOrderStatusState }) => (
  <div className="order-list">
    { orderList && orderList.length > 0 && (
      <div className="grid-x cell small-12">
        <h2>{ heading }</h2>
        <div className="grid-x cell small-12 order-status-headings-top">
          <div className="order-status-heading cell large-2">Order #</div>
          <div className="order-status-heading cell large-2">Order Placed</div>
          <div className="order-status-heading cell large-2">Total</div>
          <div className="order-status-heading cell large-2">Balance</div>
          <div className="order-status-heading cell large-2">Status</div>
          <div className="order-status-heading cell large-2"></div>
        </div>
        <div className="grid-x cell small-12 order-status-orders">
          { orderList.map(order => (
            <OrderListItem
              order={ order }
              key={ order.OrderNumber + order.OrderDate }
              setOrderStatusState={ setOrderStatusState }
            />
          )) }
        </div>
      </div>
    ) }
  </div>
)
