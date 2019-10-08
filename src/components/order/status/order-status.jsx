import React from 'react'
import './order-status.sass'
import OrderList from './order-list'
import OrderDetails from './order-details'
import OrderSearch from './order-search'

export default class OrderStatus extends React.Component {
  render() {
    const { orderDetails, orderList, setOrderStatusState } = this.props
    let activeOrders, pastOrders
    if (orderList && orderList.length > 0) {
      activeOrders = orderList.filter(order => order.Active)
      pastOrders = orderList.filter(order => !order.Active)
    }
    return (
      <div className="order-status grid-container">
        { !orderDetails && (
          <div className="cell small-12 card grid-x">
            <OrderSearch setOrderStatusState={ setOrderStatusState } />
          </div>
        ) }
        { orderDetails && (
          <div className="grid-x cell card small-12">
            <hr />
            <OrderDetails order={ orderDetails } setOrderStatusState={ setOrderStatusState } />
          </div>
        ) }
        <div ref="order-details">
          { !orderDetails && orderList && (
            <div className="grid-x cell small-12 card active-orders-list">
              { activeOrders && activeOrders.length > 0 && (
                <>
                  <hr />
                  <OrderList
                    orderList={ activeOrders }
                    heading="Active Orders"
                    setOrderStatusState={ setOrderStatusState }
                  />
                </>
              ) }
              { pastOrders && pastOrders.length > 0 && (
                <>
                  <hr />
                  <OrderList orderList={ pastOrders } heading="Past Orders" setOrderStatusState={ setOrderStatusState } />
                </>
              ) }
            </div>
          ) }
        </div>
      </div>
    )
  }
}
