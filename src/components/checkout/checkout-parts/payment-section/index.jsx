import React from 'react'
import { connect } from 'react-redux'
import { handleAffirm } from '../../../../lib/helpers/checkout/payment-section/affirm'
import PaymentSection from './payment-section'
import '../../../../assets/css/components/checkout/checkout-parts/payment-section/payment-section.sass'

class PaymentSectionWrapper extends React.Component {
  state = {
    morePaymentMethods: false,
    ccForm: null,
    mountLoad: false,
  }

  componentDidMount() {
    handleAffirm()
  }

  render() {
    const { paymentInvalidFields } = this.props
    return <PaymentSection { ...this.props } invalidFields={ paymentInvalidFields } />
  }
}

const mapStateToProps = state => {
  return {
    order: state.checkout.order,
    checkoutStep: state.checkout.checkoutStep,
    checkoutStepsCompleted: state.checkout.checkoutStepsCompleted,
    paymentInvalidFields: state.checkout.paymentInvalidFields,
  }
}

export default connect(mapStateToProps)(PaymentSectionWrapper)
