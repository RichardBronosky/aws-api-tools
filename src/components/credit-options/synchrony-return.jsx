import React from 'react'
import RTGLink from '../shared/link'
import creditCard from '../../assets/images/synchrony-return/creditCard.png'
import payPal from '../../assets/images/synchrony-return/payPal.png'
import inStore from '../../assets/images/synchrony-return/inStore.png'
import inStoreNow from '../../assets/images/synchrony-return/inStoreNow.png'
import affirm from '../../assets/images/synchrony-return/affirm.png'
import visaCheckout from '../../assets/images/synchrony-return/visaCheckout.png'
import '../../assets/css/components/credit-options/synchrony-return.sass'

export default () => (
  <div className="synchrony-return">
    <span className="although">Although Synchrony Bank is unable to approve credit for you at this time,</span>
    <span className="please">
      Please check out some other <span className="blue">payment options</span> below:
    </span>
    <div className="payment-options">
      <div className="grid-x">
        <div className="small-6 medium-4">
          <img alt="Visa, MasterCard, American Express, Discover: Credit Card" src={ creditCard } />
        </div>
        <div className="small-6 medium-4">
          <img alt="Paypal: Online Only" src={ payPal } />
        </div>
        <div className="small-6 medium-4">
          <img alt="Affirm: Online Only" src={ affirm } />
        </div>
        <div className="small-6 medium-4">
          <img alt="Visa Checkout: Online Only" src={ visaCheckout } />
        </div>
        <div className="small-6 medium-4">
          <RTGLink
            data={ {
              slug: '/stores',
              category: 'synchrony-return',
              action: 'specialty finance click',
              label: 'specialty finance',
            } }
          >
            <img alt="" role="presentation" aria-hidden="true" src={ inStore } />
            <span className="hide508">
              Specialty Finance Options with 6 months deferred intrest if approved: In store only. Find a showroom.
            </span>
          </RTGLink>
        </div>
        <div className="small-6 medium-4">
          <RTGLink
            data={ {
              slug: '/stores',
              category: 'synchrony-return',
              action: 'acceptance now click',
              label: 'acceptance now',
            } }
          >
            <img alt="" role="presentation" aria-hidden="true" src={ inStoreNow } />
            <span className="hide508">Acceptance Now: In store only. Find a showroom.</span>
          </RTGLink>
        </div>
      </div>
    </div>
    <RTGLink
      id="synchrony-return-shop-btn"
      className="blue-action-btn"
      aria-describedby="synchrony-return-title"
      data={ {
        slug: '/',
        category: 'synchrony-return',
        action: 'click',
        label: 'shop now',
      } }
    >
      Shop Now
    </RTGLink>
  </div>
)
