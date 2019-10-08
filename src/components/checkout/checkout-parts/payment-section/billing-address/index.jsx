import React from 'react'
import BillingAddress from './billing-address'
import {
  validateBillingAddress,
  submitBillingAddress,
} from '../../../../../lib/helpers/checkout/payment-section/billing-address'

export default class BillingAddressWrapper extends React.Component {
  state = {
    invalidFields: [],
    loading: false,
  }

  submitBillingAddress = async () => {
    this.setBillingState({ loading: true })
    const invalidFields = await validateBillingAddress(this.props.order)
    this.setState({ invalidFields })
    if (invalidFields.length < 1) {
      submitBillingAddress(this.setBillingState)
    } else {
      this.setBillingState({ loading: false })
    }
  }

  setBillingState = state => this.setState(state)

  clearInvalidFields = () => this.setState({ invalidFields: [] })

  render() {
    const { order } = this.props
    const { invalidFields, loading } = this.state
    return (
      <BillingAddress
        order={ order }
        invalidFields={ invalidFields }
        loading={ loading }
        submitBillingAddress={ this.submitBillingAddress }
        clearInvalidFields={ this.clearInvalidFields }
        setBillingState={ this.setBillingState }
      />
    )
  }
}
