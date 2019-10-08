import React from 'react'
import { getCurrentLocation } from '../../../lib/helpers/geo-location'
import ShippingCosts from './shipping-costs'

export default class ShippingCostsWrapper extends React.Component {
  state = {
    zipCode: getCurrentLocation().zip,
    errorMessage: null,
  }

  setShippingCostsState = state => this.setState(state)

  render() {
    const { zipCode, errorMessage } = this.state
    return <ShippingCosts zipCode={ zipCode } errorMessage={ errorMessage } setState={ this.setShippingCostsState } />
  }
}
