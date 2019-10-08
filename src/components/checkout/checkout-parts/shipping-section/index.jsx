import React from 'react'
import { connect } from 'react-redux'
import ShippingSection from './shipping-section'

const ShippingSectionWrapper = ({ order, checkoutStep, shippingInvalidFields }) => (
  <ShippingSection order={ order } checkoutStep={ checkoutStep } invalidFields={ shippingInvalidFields } />
)

const mapStateToProps = state => {
  return { ...state.checkout }
}

export default connect(mapStateToProps)(ShippingSectionWrapper)
