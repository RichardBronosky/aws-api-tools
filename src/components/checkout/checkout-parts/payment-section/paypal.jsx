import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import scriptLoader from 'react-async-script-loader'
import loaderDark from '../../../../assets/images/loader-dark.svg'
import { getPayPalTotal, createOrder, onApprove } from '../../../../lib/helpers/checkout/payment-section/paypal'

class PaypalButton extends React.Component {
  state = {
    showButton: false,
    clicked: false,
    total: null,
    loading: false,
  }

  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed, total }) {
    if (!this.state.show) {
      if (isScriptLoaded && !this.props.isScriptLoaded) {
        if (isScriptLoadSucceed) {
          this.PayPalButton = paypal.Buttons.driver('react', { React, ReactDOM })
          this.setUp(total)
        } else {
          // TODO: error message for paypal not loading?
          console.log('Cannot load Paypal script!')
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.total !== this.props.total || (prevProps.show !== this.props.show && this.props.show)) {
      this.setUp(this.props.total)
    }
  }

  setUp = async total => {
    this.setState({
      showButton: false,
    })
    const ppTotal = getPayPalTotal(total)
    this.setState({
      showButton: ppTotal ? true : false,
      total: ppTotal ? ppTotal : null,
    })
  }

  setLoading = isLoading => {
    this.setState({
      loading: isLoading,
    })
  }

  createOrder = (data, actions, total) => {
    const shippingPreference = this.props.isCheckout ? 'NO_SHIPPING' : 'GET_FROM_FILE'
    addToDataLayer('click', 'cart', 'paypal')
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total,
          },
        },
      ],
      application_context: {
        user_action: 'CONTINUE',
        shipping_preference: shippingPreference,
      },
    })
  }

  onApprove = (data, actions) => {
    return actions.order.get().then(data => {
      let shippingAddress
      if (
        data.purchase_units &&
        data.purchase_units.length > 0 &&
        data.purchase_units[0].shipping &&
        data.purchase_units[0].shipping.address
      ) {
        shippingAddress = data.purchase_units[0].shipping.address
      }
      const paymentObj = {
        paid: true,
        cancelled: false,
        paypalOrderId: data.id,
        name: data.payer.name,
        shippingAddress: shippingAddress,
        address: data.payer.address,
        email: data.payer.email_address,
        phone: data.payer.phone.phone_number.national_number.replace(/-/g, ''),
        payer_status: data.status,
      }
      this.props.onSuccess(paymentObj, this.props.isCheckout, this.props.setActiveMenu, this.setLoading)
    })
  }

  render() {
    const { showButton, total, clicked, loading } = this.state
    return (
      <>
        { showButton && total && (typeof paypal !== 'undefined' && paypal !== null) && (
          <div className={ classNames({ hide: clicked }) }>
            <this.PayPalButton
              createOrder={ (data, actions) => createOrder(data, actions, total, this.props.isCheckout) }
              onApprove={ (data, actions) => onApprove(data, actions, this.props.isCheckout, this.setLoading) }
              onCancel={ () => this.setState({ clicked: false, loading: false }) }
              onError={ () => this.setState({ clicked: false, loading: false }) }
              onClick={ () => this.setState({ clicked: true }) }
              style={ {
                color: 'blue',
                shape: 'rect',
                size: 'medium',
                tagline: false,
                layout: 'horizontal',
              } }
            />
          </div>
        ) }
        { (clicked || loading || !showButton) && <img className="loader" alt="Loading PayPal Button" src={ loaderDark } /> }
      </>
    )
  }
}

export default scriptLoader(
  `https://www.paypal.com/sdk/js?client-id=${ process.env.GATSBY_PAYPAL_API_KEY }&intent=authorize&commit=false&disable-funding=credit`
)(PaypalButton)
