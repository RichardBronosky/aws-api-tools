import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import RTGLink from '../../shared/link'
import Modal from 'react-modal'
import InfoModal from '@shared/info-modal'
import { graphql, StaticQuery } from 'gatsby'
import ContentfulHtml from '@shared/contentful-html'
import '../../../assets/css/components/product/product-parts/add-to-cart-modal.sass'
import ProductLocation from '../product-parts/product-location'
import { getCurrentLocation, getRegionZone } from '../../../lib/helpers/geo-location'
import { fetchProductWarehouseAvailability } from '../../../lib/services/product'
import {
  productPrice,
  getRequiredAddon,
  isProductStrikeThrough,
  availabilityStockMessage,
} from '../../../lib/helpers/product'
import { currencyFormatUS } from '../../../lib/helpers/string-helper'
import { addToCart, getCartItemQuantity, cartProduct } from '../../../lib/helpers/cart'
import { analyticsProduct } from '../../../lib/helpers/google-tag-manager'
import { fetchPromotions } from '../../../lib/services/checkout'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

class AddToCartModal extends React.Component {
  state = {
    stockMessage: '',
    tooMany: false,
    includesRequiredAddon: false,
    requiredAddons: null,
    allActiveAddons: null,
    requiredSelected: null,
    reqConfirmed: false,
    reqAddedToCart: false,
    discount: 0,
    showInfoModal: false,
  }

  componentDidMount() {
    this.setUp()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.addons !== this.props.addons && this.props.addons) {
      this.setUp()
    }
  }

  setStockMessage = message => {
    this.setState({
      stockMessage: message,
    })
  }

  setUp = () => {
    const { stockMessage, product } = this.props
    const includesRequiredAddon = this.includesRequiredAddon()
    if ((!stockMessage || typeof stockMessage === 'undefined') && product.sku !== '83333333') {
      const rtg_location = getCurrentLocation()
      if (
        rtg_location &&
        product &&
        (rtg_location.region !== 'OOM' ||
          ((product.delivery_type === 'O' || product.delivery_type === 'U') && rtg_location.region === 'OOM'))
      ) {
        fetchProductWarehouseAvailability(product.sku, rtg_location.distribution_index, rtg_location.state)
          .then(data => {
            const availStockMessage = availabilityStockMessage(data, product, rtg_location, this.setStockMessage)
            if (
              availStockMessage !== 'Discontinued' &&
              availStockMessage !== 'Available Soon' &&
              availStockMessage !== 'Out of Stock'
            ) {
              !includesRequiredAddon && this.addToCartAttempt()
            }
          })
          .catch(() => this.setStockMessage('Out of stock'))
      } else if (product.delivery_type !== 'O' && product.delivery_type !== 'U' && rtg_location.region === 'OOM') {
        this.setStockMessage('Not available in your region')
      } else {
        this.setStockMessage(stockMessage)
        if (stockMessage !== 'Out of stock' && stockMessage !== 'Discontinued' && stockMessage !== 'Available Soon') {
          !includesRequiredAddon && this.addToCartAttempt()
        }
      }
    } else {
      this.setStockMessage(stockMessage)
      if (
        stockMessage !== 'Out of stock' &&
        stockMessage !== 'Not available in your region' &&
        stockMessage !== 'Discontinued' &&
        stockMessage !== 'Available Soon'
      ) {
        !includesRequiredAddon && this.addToCartAttempt()
      }
    }
  }

  includesRequiredAddon = () => {
    const { addons, requiredSelected, activeAddons } = this.props
    let includesRequiredAddon = false
    if (addons && (requiredSelected === null || typeof requiredSelected === 'undefined')) {
      const requiredAddons = addons.filter(addon => addon.addon_required)
      includesRequiredAddon = requiredAddons.length > 0 && !activeAddons.includes(requiredAddons[0])
      this.setState({
        includesRequiredAddon: includesRequiredAddon,
        requiredAddons: requiredAddons.length > 0 ? requiredAddons : null,
      })
    }
    return includesRequiredAddon
  }

  onAddRequiredAddon = requiredAddon => {
    const allActiveAddons = [
      ...this.props.activeAddons,
      ...this.state.requiredAddons.filter(addon => requiredAddon.skus.includes(addon.sku)),
    ]
    this.addToCartAttempt(this.state.requiredSelected && allActiveAddons)
    this.setState({ allActiveAddons: this.state.requiredSelected && allActiveAddons, reqAddedToCart: true })
  }

  addToCartAttempt = (allActiveAddons = null) => {
    const { product, index, activeAddons, promoItems, promoQualifierQuantity, promoTargetQuantity } = this.props
    let newActiveAddons = activeAddons
    if (allActiveAddons) {
      newActiveAddons = allActiveAddons
    }
    const quantity = getCartItemQuantity(product.sku)
    if (quantity === 10) {
      this.setState({
        tooMany: true,
      })
    } else {
      let finalActiveAddons
      if (newActiveAddons && newActiveAddons.length > 0) {
        finalActiveAddons = newActiveAddons
      } else {
        finalActiveAddons = null
      }
      let reducedActiveAddons = []
      if (finalActiveAddons && finalActiveAddons.length > 0) {
        for (let i = 0, n = finalActiveAddons.length; i < n; i++) {
          reducedActiveAddons.push(cartProduct(finalActiveAddons[i]))
        }
      } else {
        reducedActiveAddons = null
      }
      if (promoItems && promoTargetQuantity && promoQualifierQuantity) {
        let requestItems = [
          {
            sku: product.sku,
            quantity: parseInt(promoQualifierQuantity),
          },
        ]
        promoItems.map(item =>
          requestItems.push({
            sku: item.sku,
            quantity: parseInt(promoTargetQuantity),
          })
        )
        fetchPromotions({
          requestItems: requestItems,
          region: getRegionZone().region,
          zone: getRegionZone().zone,
        }).then(data => {
          this.setState({
            discount: data.totalSavings || 0,
          })
        })
        for (let x = 0; x < promoQualifierQuantity; x++) {
          addToCart(product, productPrice(product), reducedActiveAddons)
        }
        let aProduct = analyticsProduct(product, promoQualifierQuantity)
        window.dataLayer.push({ event: 'ee_add', ecommerce: { add: { position: index, products: [aProduct] } } })
        for (let i = 0, n = promoItems.length; i < n; i++) {
          for (let x = 0; x < promoTargetQuantity; x++) {
            addToCart(promoItems[i], 0)
          }
          aProduct = analyticsProduct(product, promoTargetQuantity)
          window.dataLayer.push({ event: 'ee_add', ecommerce: { add: { position: index, products: [aProduct] } } })
        }
      } else {
        addToCart(product, productPrice(product), reducedActiveAddons)
        allActiveAddons && this.setState({ reqAddedToCart: true })
        product['active_addons'] = finalActiveAddons
          ? finalActiveAddons.map(p => analyticsProduct(p, p.quantity || 1))
          : []
        let aProduct = analyticsProduct(product, 1)
        window.dataLayer.push({ event: 'ee_add', ecommerce: { add: { position: index, products: [aProduct] } } })
      }
    }
  }

  onChangeRequiredAddons = value => {
    this.setState({
      requiredSelected: value,
      reqConfirmed: true,
    })
  }

  render() {
    const {
      modalOpen,
      product,
      closeModal,
      activeAddons,
      promoDescription,
      promoItems,
      promoQualifierQuantity,
      promoTargetQuantity,
      promoTargetPrice,
      promoStrikethroughPrice,
    } = this.props
    const {
      stockMessage,
      tooMany,
      requiredAddons,
      includesRequiredAddon,
      requiredSelected,
      reqConfirmed,
      reqAddedToCart,
      allActiveAddons,
      discount,
      showInfoModal,
    } = this.state

    const requiredAddon = getRequiredAddon(requiredAddons)
    const strikethrough = isProductStrikeThrough(product)

    const buttonText = `view cart 
    ${
      stockMessage !== 'Out of stock' && stockMessage !== 'Discontinued' && stockMessage !== 'Available Soon'
        ? '& checkout'
        : ''
    }`

    return (
      <Modal
        isOpen={ modalOpen }
        onRequestClose={ closeModal }
        contentLabel="Add To Cart Modal"
        className="add-to-cart-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <div className="card grid-x grid-margin-x">
            { (!includesRequiredAddon || reqAddedToCart) &&
              !tooMany &&
              stockMessage !== 'Out of stock' &&
              stockMessage !== 'Not available in your region' &&
              stockMessage !== 'Discontinued' &&
              stockMessage !== 'Available Soon' && (
                <div className="cell small-12 added-to-cart-checkmark">
                  <svg className="checkmark-add-to-cart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-add-to-cart__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark-add-to-cart__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>

                  <h3>{ promoDescription ? promoDescription : 'added to cart' }</h3>
                  { promoItems && discount > 0 && (
                    <span className="savings-text">
                      Offer Savings: <span className="savings-amount">{ currencyFormatUS(discount) }</span>
                    </span>
                  ) }
                </div>
              ) }
            { includesRequiredAddon &&
              !reqAddedToCart &&
              !tooMany &&
              stockMessage !== 'Out of stock' &&
              stockMessage !== 'Not available in your region' &&
              stockMessage !== 'Discontinued' &&
              stockMessage !== 'Available Soon' && (
                <>
                  <h3 className="unable black">Please accept or decline required add-ons.</h3>
                </>
              ) }
            { !includesRequiredAddon &&
              !tooMany &&
              (stockMessage === 'Out of stock' ||
                stockMessage === 'Not available in your region' ||
                stockMessage === 'Discontinued' ||
                stockMessage === 'Available Soon') && (
                <>
                  <h3 className="unable">Unable to add to cart</h3>
                  <h3 className="out-of-stock">
                    { stockMessage === 'Out of stock' ||
                    stockMessage === 'Discontinued' ||
                    stockMessage === 'Available Soon'
                      ? 'Product is currently out of stock.'
                      : 'Product is not available in your region.' }
                  </h3>
                </>
              ) }
            { tooMany && (
              <>
                <h3 className="unable">Unable to add to cart</h3>
                <h3 className="out-of-stock">You have already added 10 of this item to your cart.</h3>
              </>
            ) }
            { includesRequiredAddon && !reqAddedToCart && requiredAddon && (
              <>
                <div className="required-addon">
                  <fieldset>
                    <legend>
                      Please accept or decline "<span dangerouslySetInnerHTML={ { __html: requiredAddon.title } } />"
                    </legend>
                    <div className="radio-option accept">
                      <input
                        type="radio"
                        id={ `Modal${ requiredAddon.title.replace(/ /g, '') }` }
                        name={ `Modal${ requiredAddon.title.replace(/ /g, '') }` }
                        checked={ requiredSelected }
                        onChange={ e => this.onChangeRequiredAddons(e.target.checked) }
                      />
                      <label htmlFor={ `Modal${ requiredAddon.title.replace(/ /g, '') }` } className="radio-label">
                        <span className="grid-y">
                          <span className="small-12" dangerouslySetInnerHTML={ { __html: requiredAddon.title } } />
                          <span className="small-12 price">{ currencyFormatUS(requiredAddon.price) }</span>
                        </span>
                      </label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id={ `ModalDecline${ requiredAddon.title.replace(/ /g, '') }` }
                        name={ `Modal${ requiredAddon.title.replace(/ /g, '') }` }
                        checked={ requiredSelected === false }
                        onChange={ e => this.onChangeRequiredAddons(!e.target.checked) }
                      />
                      <label htmlFor={ `ModalDecline${ requiredAddon.title.replace(/ /g, '') }` } className="radio-label">
                        No, I decline { requiredAddon.decline }
                      </label>
                    </div>
                  </fieldset>
                  { requiredAddon.title.indexOf('Bunkie') > -1 && (
                    <button
                      gtm-category={ 'bunkie-board-modal' }
                      gtm-action={ 'click' }
                      gtm-label={ 'cart' }
                      className={ 'bunkie-board addon-learn-more' }
                      onClick={ () => this.setState({ showInfoModal: true }) }
                    >
                      What is a bunkie board? &#9432;
                    </button>
                ) }
                </div>
              </>
            ) }
            <div className="add-to-cart-modal-products cell small-12">
              { product && (
                <div className="main modal-mid grid-x grid-margin-x" key={ `add-to-cart-modal-product_${ product.sku }` }>
                  <div className="horizontal-center cell small-12 medium-6">
                    <img
                      className="vertical-center modal-product-image"
                      src={ `${ product.primary_image }${ product.sku !== '83333333' ? '&h=150' : '' }` }
                      alt={ product.title }
                    />
                  </div>
                  <div className="cell small-12 medium-5 modal-pricing">
                    <div className="product-title" dangerouslySetInnerHTML={ { __html: product.title } } />
                    <span className="product-title">
                      { promoQualifierQuantity && promoQualifierQuantity > 1 && ` (${ promoQualifierQuantity })` }
                    </span>
                    <div className="product-pricing">
                      { strikethrough && (
                        <p className="strikethrough">
                          { currencyFormatUS(productPrice(product, strikethrough) * (promoQualifierQuantity || 1)) }
                        </p>
                      ) }
                      <p className={ strikethrough ? 'strikethrough-sale' : '' }>
                        { currencyFormatUS(productPrice(product) * (promoQualifierQuantity || 1)) }
                      </p>
                    </div>
                    <ProductLocation addToCart stockMessage={ stockMessage } />
                  </div>
                </div>
              ) }
              { ((allActiveAddons && allActiveAddons.length > 0) || (activeAddons && activeAddons.length > 0)) && (
                <div className="addons">
                  { (allActiveAddons || activeAddons).map((product, index) => (
                    <div className="active-addon modal-mid grid-x grid-margin-x" key={ index }>
                      <div className="horizontal-center cell small-6 medium-6">
                        <i className="icon checkmark" />
                      </div>
                      <div className="cell small-6 medium-6 modal-pricing">
                        <div className="product-title">
                          <span dangerouslySetInnerHTML={ { __html: product.title } } />
                          { `${ product.quantity > 1 ? ` (${ product.quantity })` : '' }` }
                        </div>
                        <div className="product-pricing">
                          { currencyFormatUS(productPrice(product) * product.quantity) }
                        </div>
                      </div>
                    </div>
                  )) }
                </div>
              ) }
              { promoItems && promoItems.length > 0 && (
                <div className="addons">
                  { promoItems.map((product, index) => (
                    <div className="active-addon modal-mid grid-x grid-margin-x" key={ index }>
                      <div className="horizontal-center cell small-4 medium-6">
                        <img
                          className="vertical-center modal-product-image addon-image"
                          src={ `${ product.image }&h=150` }
                          alt={ product.title }
                        />
                      </div>
                      <div className="cell small-8 medium-6 modal-pricing">
                        <div className="product-title">{ product.title }</div>
                        <span className="product-title">
                          { promoTargetQuantity && promoTargetQuantity > 1 && ` (${ promoTargetQuantity })` }
                        </span>
                        { promoStrikethroughPrice && (
                          <div className="product-pricing strikethrough">
                            { currencyFormatUS(promoStrikethroughPrice * promoTargetQuantity) }
                          </div>
                        ) }
                        <div className="product-pricing sale">
                          { currencyFormatUS(promoTargetPrice * promoTargetQuantity) }
                        </div>
                      </div>
                    </div>
                  )) }
                </div>
              ) }
            </div>
            <div className="cell small-12">
              <div className="grid-x grid-margin-x modal-buttons">
                <div className="cell small-12 medium-6">
                  <button
                    className="continue-shopping"
                    tabIndex="0"
                    value="Continue Shopping"
                    aria-label="Continue Shopping"
                    onClick={ closeModal }
                  >
                    { '<' } continue shopping
                  </button>
                </div>
                <div className="cell small-12 medium-6">
                  { includesRequiredAddon && !reqAddedToCart && (
                    <button
                      className={ classNames('checkout', { unavailable: !reqConfirmed }) }
                      tabIndex="0"
                      value="Add to cart"
                      aria-label="Add to cart"
                      onClick={ () => this.onAddRequiredAddon(requiredAddon) }
                      disabled={ !reqConfirmed }
                    >
                      Add to cart
                    </button>
                  ) }
                  { (!includesRequiredAddon || (includesRequiredAddon && reqConfirmed && reqAddedToCart)) && (
                    <>
                      { window && !window.location.pathname.includes('/cart') && (
                        <RTGLink
                          data={ {
                            slug: '/cart',
                            title: 'Cart',
                          } }
                          aria-label="View Cart & Checkout"
                          className="checkout"
                        >
                          { buttonText }
                        </RTGLink>
                      ) }
                      { window && window.location.pathname.includes('/cart') && (
                        <button onClick={ closeModal } aria-label="View Cart & Checkout" className="checkout">
                          { buttonText }
                        </button>
                      ) }
                    </>
                  ) }
                </div>
              </div>
            </div>
            <button className="close-modal" tabIndex="0" value="Close" aria-label="Close" onClick={ closeModal }>
              <img
                className="icon close"
                alt="close icon"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
              />
            </button>
          </div>
        </div>
        { showInfoModal &&
          <InfoModal
            label={ 'What is a Bunkie Board?' }
            btnClass={ 'bunkie-board' }
            mdlClass={ 'rtg-bunkie-board-modal' }
            shouldShowModal={showInfoModal}
            closeModal={ () => this.setState({ showInfoModal: false }) }
          >
            <StaticQuery
              query={ graphql`
                query ModalInfoQuery2 {
                  contentfulHtml(contentful_id: { eq: "3j3tLJvWUBQ3Tyx0AMEp0h" }) {
                    ...ContentfulHtml
                  }
                }
              ` }
              render={ data => <ContentfulHtml data={ data.contentfulHtml } /> }
            />
          </InfoModal>
        }
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.cart }
}

export default connect(
  mapStateToProps,
  null
)(AddToCartModal)
