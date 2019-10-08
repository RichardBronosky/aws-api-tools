import React from 'react'
import GiftCardAccordions from '../accordions'
import AddToCartModal from '@components/product/product-parts/add-to-cart-modal'
import RTGLink from '@shared/link'
import giftCardImage from '@assets/images/gift-cards.jpg'
import './gift-card-purchase.sass'
import { getGiftCardProductData } from '@helpers/product'
import { setupAnalytics } from '@helpers/google-tag-manager'

export default class GiftCards extends React.Component {
  state = {
    modalOpen: false,
  }

  constructor(props) {
    super(props)
    this.giftCardData = getGiftCardProductData()
  }

  componentDidMount() {
    setupAnalytics({ pageData: { type: 'gift-card', title: 'Gift Card Purchase', path: '/gift-card/purchase' } })
  }

  closeModal() {
    if (this.state.modalOpen) {
      this.setState({
        modalOpen: false,
      })
    }
  }

  render() {
    return (
      <div className="gc-page card">
        <div>
          { ' ' }
          <h1 className="gc-header ">ROOMS TO GO GIFT CARDS</h1>
        </div>

        <div className="gc-wrapper grid-x">
          <div className="small-12 large-6 grid-x cell gc-right">
            <p>
              The Rooms To Go gift card is an ideal gift choice for weddings, graduations, anniversaries and so many
              other special occasions.
            </p>
            <p>You will receive your Gift Card via certified mail, with no shipping or handling cost to you!</p>
            <p>
              NOTE: For security purposes, Gift Cards will only be mailed to purchaser's billing address in the
              Contiguous U.S.
            </p>
            <RTGLink
              target="_blank"
              data={ {
                slug: '/gift-cards/balance',
                title: 'Rooms To Go Gift Card Balance',
                category: 'gift-card',
                action: 'click',
                label: 'gift card balance',
              } }
              className="link blue-action-btn"
            >
              Check Gift Card Balance
            </RTGLink>

            <div className="small-12">
              <GiftCardAccordions />
            </div>
          </div>
          <div className="gc-content-wrapper grid-x small-12 large-6">
            <div className="gift-card-tile grid-x small-12 large-6 card pop-out">
              <div className="small-12 gc-image">
                <img src={ giftCardImage } />
              </div>
              <div className="gc-add-to-cart-wrapper small-12">
                <span className="gc-label">$100 Gift Card</span>
                <button className="blue-action-btn" onClick={ () => this.setState({ modalOpen: true }) }>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
          <div></div>
          { this.state.modalOpen && (
            <AddToCartModal
              modalOpen={ this.state.modalOpen }
              product={ this.giftCardData }
              price={ this.giftCardData.price }
              closeModal={ () => this.closeModal() }
              index={ 0 }
            />
          ) }
        </div>
      </div>
    )
  }
}
