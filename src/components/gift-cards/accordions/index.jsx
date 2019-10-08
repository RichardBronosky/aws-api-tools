import React from 'react'
import Accordion from '@components/shared/accordion'
import RTGLink from '@components/shared/link'
import './gift-card-accordions.sass'

export default () => (
  <div className="gc-accordions">
    <Accordion data={ { heading: 'Gift Card FAQs', id: 'gf-faqs', hidden: true } }>
      <div className="gc-faq-wrapper">
        <span className="gc-faq-title">Can I buy Rooms To Go gift cards online?</span>
        <span>Yes, you may purchase Rooms To Go gift cards online at roomstogo.com.</span>
      </div>
      <div className="gc-faq-wrapper">
        <span className="gc-faq-title">How do I redeem a Rooms To Go gift card online?</span>
        <span>
          Shop roomstogo.com, choose merchandise you wish to buy and add it to your shopping cart. At Checkout, a space
          is provided to enter the gift card number, which is located on the back of the gift card, as well as the PIN
          number, also provided on the back.
        </span>
      </div>
      <div className="gc-faq-wrapper">
        <span className="gc-faq-title">Can I redeem a Rooms To Go gift card in a Rooms To Go showroom?</span>
        <span>
          Yes, your gift card may be redeemed in any Rooms To Go or Rooms To Go Kids showroom in the Contiguous U.S.
          Sorry, gift cards cannot be redeemed in showrooms outside the United States at this time.
        </span>
      </div>
      <div className="gc-faq-wrapper">
        <span className="gc-faq-title">What are the shipping charges for Rooms To Go gift cards?</span>
        <span>
          Your gift card will be sent free of charge via certified mail. Please be aware that gift cards will only be
          mailed to the purchaser's billing address, not your intended recipient. This is for security purposes.
        </span>
      </div>
    </Accordion>
    <Accordion data={ { heading: 'Terms and conditions', id: 'gf-terms', hidden: true } }>
      <div>
        <p>
          The Rooms To Go gift card is easy to carry and easy to use. Once activated, this card is redeemable for
          merchandise at any Rooms To Go or Rooms To Go Kids showroom, or online at roomstogo.com. Please note that the
          pin number from the gift card is required to redeem online. Checking the gift card balance is simple, by
          calling 1-888-228-0144 or by
          <RTGLink
            data={ {
              slug: '/gift-cards/balance',
              title: 'Rooms To Go Gift Card Balance',
              category: 'gift-card',
              action: 'click',
              label: 'gift card balance',
              text: ' clicking here',
            } }
          />
          . The Rooms To Go gift card will be mailed to you at no charge. It is our policy to mail the card to the
          purchaser's billing address. This card has no cash value and is not redeemable for cash, nor will it be
          replaced if lost or stolen. Gift cards may not be applied towards prior purchases or account balances or to
          purchase additional Gift cards. Gift cards are not returnable or refundable. Any balance remains on the Gift
          card until it is spent. The Rooms To Go gift card is an ideal gift choice for weddings, graduations,
          anniversaries and so many other special occasions.
        </p>
      </div>
    </Accordion>
  </div>
)
