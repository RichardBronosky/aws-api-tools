import React from 'react'
import { abbreviateState } from '../../../../lib/helpers/geo-location'
import { getGiftCards, setOrderGiftCardInfo } from '../../../../lib/helpers/checkout/payment-section/gift-cards'
import {
  getActualPaymentType,
  getPaymentCondensedAddressInfo,
  canShowBilling,
  getCreditCardType,
} from '../../../../lib/helpers/checkout/payment-section/payment-section'
import { getPayPalEmail } from '../../../../lib/helpers/checkout/payment-section/paypal'
import { setCheckoutStep } from '../../../../lib/helpers/checkout/global'
import visaLogo from '../../../../assets/images/visa.png'
import mcLogo from '../../../../assets/images/mastercard.png'
import amexLogo from '../../../../assets/images/amex.png'
import discoverLogo from '../../../../assets/images/discover.png'
import '../../../../assets/css/components/checkout/checkout-parts/payment-section/payment-condensed.sass'

export default ({ order }) => {
  const shippingInfoArr = order.shippingAddress.addressLookup.split(',')
  const cardType = getCreditCardType(order)
  const giftCards = getGiftCards()
  const actualPaymentType = getActualPaymentType(order)
  const showBilling = canShowBilling(order)
  const addressInfo = getPaymentCondensedAddressInfo(order, actualPaymentType)
  return (
    <div className="payment-condensed grid-x">
      { showBilling && (
        <div className="billing-condensed small-12 large-8">
          <h3>Billing Information</h3>
          <div className="left-info">
            { actualPaymentType !== 'Affirm' && addressInfo.firstName + ' ' + addressInfo.lastName }
            <br />
            { actualPaymentType !== 'Visa Checkout' &&
              actualPaymentType !== 'Affirm' &&
              actualPaymentType !== 'Rooms To Go Finance' && (
                <>
                  { order.shippingAddress.addressLookup &&
                    order.shippingAddress.addressLookupSuccess &&
                    !order.payer.billingDifferent &&
                    actualPaymentType !== 'PayPal' && (
                      <>
                        { shippingInfoArr[0] }
                        <br />
                        { shippingInfoArr[1] }
                      </>
                    ) }
                  { (!order.shippingAddress.addressLookupSuccess ||
                    actualPaymentType === 'PayPal' ||
                    order.payer.billingDifferent) && (
                    <>
                      { addressInfo.address1 }
                      { addressInfo.address2 !== '' && ' ' + addressInfo.address2 }
                      <br />
                      { addressInfo.city + ' ' }
                      { abbreviateState(addressInfo.state) + ' ' }
                      { addressInfo.zip }
                    </>
                  ) }
                </>
              ) }
            { (actualPaymentType === 'Visa Checkout' || actualPaymentType === 'Rooms To Go Finance') && addressInfo.zip }
          </div>

          { actualPaymentType && (
            <>
              { actualPaymentType === 'PayPal' && (
                <div className="right-info">
                  <img
                    src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                    alt="PayPal Logo"
                  />
                  <br />
                  { getPayPalEmail(order) }
                </div>
              ) }
              { actualPaymentType === 'Visa Checkout' && (
                <div className="right-info">
                  <img
                    alt="Visa Checkout"
                    src="https://assets.secure.checkout.visa.com/VCO/images/acc_99x34_blu01.png"
                  />
                </div>
              ) }
              { actualPaymentType === 'Affirm' && (
                <div className="right-info">
                  <img
                    className="affirm-logo"
                    alt="Affirm Logo"
                    src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzEuNjQgMTY2LjA0Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzJiYzJkZjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmxvZ290eXBlX2JsdWU8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI5OC4zOSwwQTE3LjU3LDE3LjU3LDAsMSwwLDMxNiwxNy41NywxNy41OSwxNy41OSwwLDAsMCwyOTguMzksMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjI4My4zIiB5PSI0Ni42OCIgd2lkdGg9IjI5Ljk5IiBoZWlnaHQ9IjExOS4zMSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQwMy40Nyw0My42MWMtMTUsMC0zMi4yNSwxMC44LTM3LjkzLDI0LjM0VjQ2LjY4SDMzNy4wOVYxNjZoMzBWMTEwLjU5YzAtMjMuNDUsOS0zNi41NCwyOC42MS0zNi45MUw0MTIuNDQsNDQuM0E2NC4xNyw2NC4xNywwLDAsMCw0MDMuNDcsNDMuNjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTI0LDQzLjY5Yy0xMi44NywwLTI0LjQxLDQuODQtMzIuNSwxMy42MmwtMC40Mi40NS0wLjQxLS40NWMtOC04Ljc4LTE5LjQ4LTEzLjYyLTMyLjM2LTEzLjYyLTI3LjU4LDAtNDcuNiwyMC4xMS00Ny42LDQ3LjgxVjE2NmgyOS41MlY5MC44NmMwLTExLjYzLDcuMS0xOS4xNCwxOC4wOC0xOS4xNHMxOC4wOSw3LjUxLDE4LjA5LDE5LjE0VjE2Nkg1MDZWOTAuODZjMC0xMS42Myw3LjEtMTkuMTQsMTguMDktMTkuMTRzMTguMDksNy41MSwxOC4wOSwxOS4xNFYxNjZoMjkuNTFWOTEuNUM1NzEuNjQsNjMuOCw1NTEuNjIsNDMuNjksNTI0LDQzLjY5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI0NywzNS42OWMwLTMuOTQuNTMtOC42NSwzLjktMTEuMjQsMy42OS0yLjg3LDkuMDktMi4zNCwxMy40Ni0yLjEybDUuODItMjEuNzItMy4xMS0uMTZjLTEyLjUyLS42Ny0yNS42OS0xLjYtMzYuNjcsNS42Ni05LjMxLDYuMTUtMTMuNDUsMTYuNzQtMTMuNDUsMjcuNjF2MTNIMTgxLjE4di0xMWMwLTMuOTIuNTItOC41OCwzLjgyLTExLjIsMy42OS0yLjkzLDkuMTYtMi4zOCwxMy41My0yLjE2bDUuODItMjEuNzItMy4xMS0uMTZjLTEyLjYyLS42OC0yNS45Mi0xLjYtMzYuOTEsNS44Ni05LjEyLDYuMTgtMTMuMTYsMTYuNjgtMTMuMTYsMjcuNDJ2MTNIMTM3LjY1VjY4LjM3aDEzLjUzVjE2NmgzMFY2OC4zN2gzNS43NlYxNjZoMzBWNjguMzdoMjAuNzdWNDYuNjhIMjQ3di0xMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMjIuNDMsMTY2bDAtMTA1LjM2YTE3LjMyLDE3LjMyLDAsMCwwLTE1LjMyLTE3Yy01LjczLS4zNy0xMS44MiwxLjczLTE1LjQxLDYuMzhMMCwxNjZIMjIuNmM5LDAsMTYuMTgtNC42OSwyMS42MS0xMS43TDk1LDkwLjA3VjE2NmgyNy40NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiLz48L3N2Zz4="
                  />
                </div>
              ) }
              { actualPaymentType === 'Rooms To Go Finance' && (
                <div className="right-info">
                  <img
                    src={ `${ process.env.GATSBY_S3_IMAGE_URL }rtg-cc.png` }
                    className="cc-img"
                    alt="Rooms To Go Finance"
                  />
                </div>
              ) }
              { actualPaymentType === 'Credit' && (
                <>
                  { cardType === '001' && (
                    <div className="right-info">
                      <img alt="Visa Logo" src={ visaLogo } />
                    </div>
                  ) }
                  { cardType === '002' && (
                    <div className="right-info">
                      <img alt="Mastercard Logo" src={ mcLogo } />
                    </div>
                  ) }
                  { cardType === '003' && (
                    <div className="right-info">
                      <img alt="Amex Logo" src={ amexLogo } />
                    </div>
                  ) }
                  { cardType === '004' && (
                    <div className="right-info">
                      <img alt="Discover Logo" src={ discoverLogo } />
                    </div>
                  ) }
                </>
              ) }
            </>
          ) }
        </div>
      ) }
      <div className="giftcard small-12 large-4">
        <h3>
          Rooms To Go Gift Card
          { giftCards.length > 1 && <>s</> }
        </h3>
        <ul>{ giftCards.length > 0 && giftCards.map((card, index) => <li key={ index }>{ card.giftCardNumber }</li>) }</ul>
        { giftCards.length < 1 && (
          <button
            tabIndex="0"
            value="Use Gift Card"
            aria-label="Use Gift Card"
            onClick={ e => {
              setOrderGiftCardInfo(true, 'useGiftCard')
              setCheckoutStep(e, 'review', 'payment')
            } }
          >
            + Use Gift Card
          </button>
        ) }
      </div>
    </div>
  )
}
