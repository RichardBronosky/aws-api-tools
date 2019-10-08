import React from 'react'
import OrderStatus from './order-status'
import { setupAnalytics } from '../../../lib/helpers/google-tag-manager'

export default class OrderStatusWrapper extends React.Component {
  state = {
    orderDetails: null,
    orderList: null,
  }

  componentDidMount() {
    setupAnalytics({ pageData: { type: 'order', title: 'Order Status', path: '/order/status' } })
  }

  setOrderStatusState = state => this.setState(state)

  render() {
    return <OrderStatus { ...this.state } setOrderStatusState={ this.setOrderStatusState } />
  }
}
