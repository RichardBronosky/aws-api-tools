import React from 'react'
import { connect } from 'react-redux'
import DeliverySection from './delivery-section'
import { setDeliveryCalendar } from '../../../../lib/helpers/checkout/delivery-section'

class DeliverySectionWrapper extends React.Component {
  componentDidMount() {
    this.setDeliveryData(this.props.order)
  }

  componentDidUpdate(prevProps) {
    const { order } = this.props
    if (
      JSON.stringify(prevProps.order.shippingAddress) != JSON.stringify(order.shippingAddress) ||
      JSON.stringify(prevProps.order.lineItems) != JSON.stringify(order.lineItems)
    ) {
      this.setDeliveryData(order)
    }
  }

  setDeliveryData = order => {
    if (
      order &&
      order.totalDeliveryCharge > -1 &&
      order.shippingAddress &&
      order.deliveryCalendar &&
      order.deliveryCalendar.length
    ) {
      setDeliveryCalendar(order.deliveryCalendar, order.pickupCalendar, order.expressDeliveryDate)
    }
  }

  render() {
    const { order, checkoutStep, checkoutStepsCompleted, deliveryInvalidFields, cart, deliveryCalendar } = this.props
    return (
      <DeliverySection
        order={ order }
        checkoutStep={ checkoutStep }
        checkoutStepsCompleted={ checkoutStepsCompleted }
        invalidFields={ deliveryInvalidFields }
        cart={ cart }
        deliveryCalendar={ deliveryCalendar }
      />
    )
  }
}

const mapStateToProps = state => {
  return { ...state.checkout, ...state.cart }
}

export default connect(mapStateToProps)(DeliverySectionWrapper)
