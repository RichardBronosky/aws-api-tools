import React from 'react'
import OrderSearch from './order-search'

export default class OrderSearchWrapper extends React.Component {
  state = {
    orderId: '',
    phoneNumber: '',
    err: null,
    loading: false,
  }

  setOrderSearchState = state => this.setState(state)

  render() {
    return (
      <OrderSearch
        { ...this.state }
        setOrderSearchState={ this.setOrderSearchState }
        setOrderStatusState={ this.props.setOrderStatusState }
      />
    )
  }
}
