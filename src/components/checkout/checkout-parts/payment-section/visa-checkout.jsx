import React from 'react'
import scriptLoader from 'react-async-script-loader'
import loaderDark from '../../../../assets/images/loader-dark.svg'
import { getGiftCards } from '../../../../lib/helpers/checkout/payment-section/gift-cards'
import { visaCheckoutSetup } from '../../../../lib/helpers/checkout/payment-section/visa-checkout'

class VisaCheckoutButton extends React.Component {
  state = {
    showButton: false,
  }

  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed, order }) {
    if (!this.state.show) {
      if (isScriptLoaded && !this.props.isScriptLoaded) {
        if (isScriptLoadSucceed) {
          this.visaCheckoutSetup(order)
        } else {
          console.log('Cannot load Visa Checkout script!')
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { order } = this.props
    if (prevProps.order !== order) {
      const prevGiftCards = getGiftCards(prevProps.order)
      const giftCards = getGiftCards(order)
      if (
        prevGiftCards !== giftCards
        // && prevProps.paymentInfo.useGiftCard !== this.props.paymentInfo.useGiftCard
      ) {
        this.setState({ showButton: false })
        this.visaCheckoutSetup(order)
      }
    }
  }

  visaCheckoutSetup = async order => {
    if (order) {
      setTimeout(() => {
        this.setState({ showButton: true }, () => visaCheckoutSetup(order), 500)
      })
    }
  }

  render() {
    return (
      <>
        { !this.state.showButton && <img className="loader" alt={ `Loading Visa Checkout Button` } src={ loaderDark } /> }
        { this.state.showButton && (
          <img
            alt="Visa Checkout"
            className="v-button"
            role="button"
            src={ `${ process.env.GATSBY_VISA_CHECKOUT_URL }/wallet-services-web/xo/button.png` }
          />
        ) }
      </>
    )
  }
}

export default scriptLoader(`${ process.env.GATSBY_VISA_ASSETS_URL }/checkout-widget/resources/js/integration/v1/sdk.js`)(
  VisaCheckoutButton
)
