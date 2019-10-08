import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import RedeemMessage from './redeem-message'
import GiftCardAccordions from '../accordions'
import { submitGC } from './balance-helper'
import { currencyFormatUS } from '@helpers/string-helper'
import loaderLight from '@images/loader-light.svg'
import './balance.sass'
import { setupAnalytics } from '@helpers/google-tag-manager'

const GiftCardBalance = ({ isMobile }) => {
  const [loading, setLoading] = React.useState(false)
  const [err, setError] = React.useState(null)
  const [number, setNumber] = React.useState('')
  const [pin, setPin] = React.useState('')
  const [balance, setBalance] = React.useState(null)

  useEffect(
    () => setupAnalytics({ pageData: { type: 'gift-card', title: 'Gift Card Balance', path: '/gift-card/balance' } }),
    []
  )

  return (
    <div className="gc-balance cell card">
      <div className="grid-x">
        { /* { !isMobile && (
          <div className="cell small-12 large-4 gc-image grid-x">
            <img
              alt="Rooms To Go Gift Cards"
              src={ `${ process.env.GATSBY_S3_IMAGE_URL }Rooms-to-Go-GiftCard.jpg` }
            />
            <RedeemMessage />
          </div>
        ) } */ }
        <div className="cell small-12">
          <h1>Check Gift Card Balance</h1>
        </div>
        <div className="cell small-12 grid-x">
          <div className="cell grid-x small-12 large-6 numbers-image">
            <img
              className="small-12"
              alt="Gift Card Number Locations"
              src={ `${ process.env.GATSBY_S3_IMAGE_URL }giftcard-diagram.jpg` }
            />
            <RedeemMessage />
          </div>
          <div className="grid-x small-12 large-6 form-area">
            <div className="small-12">
              <p>Fill in the fields below to retrieve your gift card balance.</p>
              <p className="asterisk">*Asterisks indicate required fields in the form below</p>
            </div>
            <form className="grid-x cell small-8">
              { err && <span className="error">{ err }</span> }
              <label className="cell small-12">16-digit Card Number</label>
              <input
                className="cell small-12"
                type="text"
                name="gift_card_number"
                maxLength={ 16 }
                id="gift_card_number"
                value={ number }
                onChange={ e => setNumber(e.target.value) }
              />
              <label className="cell small-12">8-digit PIN Number</label>
              <input
                className="cell small-12"
                type="text"
                maxLength={ 8 }
                name="gift_card_pin"
                id="gift_card_pin"
                value={ pin }
                onChange={ e => setPin(e.target.value) }
              />
              <button
                className="primary"
                gtm-category="gift-card"
                gtm-action="gift card balance check"
                gtm-label="gift-card-balance"
                onClick={ e => !loading && submitGC(e, number, pin, setError, setLoading, setBalance) }
              >
                { !loading ? (
                  'Check Card Balance'
                ) : (
                  <img className="loader" alt="loading gift card balance" src={ loaderLight } />
                ) }
              </button>
              { !err && balance && Number(balance) > 0 && (
                <p className="balance">
                  Your card has a balance of <span>{ currencyFormatUS(balance) }</span>!
                </p>
              ) }
              { !err && balance && Number(balance) <= 0 && (
                <p className="balance zero">
                  Your card has a balance of <span>{ currencyFormatUS(balance) }</span>.
                </p>
              ) }
            </form>
          </div>
        </div>
        <div className="cell accordians">
          <GiftCardAccordions />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return { isMobile: state.global.isMobile }
}

export default connect(mapStateToProps)(GiftCardBalance)
