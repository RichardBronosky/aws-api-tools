import React from 'react'
import '../../../assets/css/components/cart/cart-parts/payment-methods.sass'
import paymentLogos from '../../../assets/images/paymentLogos.png'

export default () => (
  <>
    <h4 className="bold">We Accept</h4>
    <img
      className="paymentLogos"
      src={ paymentLogos }
      alt="Accepted payment types: Discover, Mastercard, Visa, Amex, Rooms to go Credit, PayPal, Affirm"
    />
  </>
)
