import React from 'react'
import { connect } from 'react-redux'
import { getLastParamOfPath } from '../../lib/helpers/string-helper'
import { verifyAndUpdateCart, cartUpdate, getPromoTargetSkus, loadCartFromOrder } from '../../lib/helpers/cart'
import { setupAnalytics } from '../../lib/helpers/google-tag-manager'
import Cart from './cart'

let apiCalled = false

class CartWrapper extends React.Component {
  state = {
    skusNotAvailable: [],
    discount: null,
    showPayPal: false,
  }

  setCartState = state => this.setState({ ...this.state, ...state })

  setApiCalled = called => {
    apiCalled = called
  }

  componentDidMount() {
    const { cart } = this.props
    const { discount, skusNotAvailable } = this.state
    setupAnalytics({ pageData: { type: 'cart', title: 'Cart', path: '/cart' } })
    const lastParam = getLastParamOfPath()
    const pattern = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}')
    if (lastParam && pattern.test(lastParam)) {
      loadCartFromOrder(lastParam)
    }
    if (JSON.stringify(cart) !== JSON.stringify({ cartItems: [] })) {
      verifyAndUpdateCart(cart)
      cartUpdate(cart, skusNotAvailable, apiCalled, discount, this.setCartState, this.setApiCalled, false)
    }
  }

  componentDidUpdate(prevProps) {
    const { cart } = this.props
    const { discount, skusNotAvailable } = this.state
    if (prevProps.cart !== cart) {
      verifyAndUpdateCart(cart)
      cartUpdate(cart, skusNotAvailable, apiCalled, discount, this.setCartState, this.setApiCalled, discount !== null)
    }
  }

  render() {
    const promoTargetSkus = getPromoTargetSkus()
    return <Cart { ...this.props } { ...this.state } promoTargetSkus={ promoTargetSkus } setCartState={ this.setCartState } />
  }
}

const mapStateToProps = state => {
  return { ...state.global, ...state.cart }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddActiveAddon: (productSku, addon, cartIndex) => dispatch(addActiveAddon(productSku, addon, cartIndex)),
    onRemoveActiveAddon: (productSku, addonSku, cartIndex) =>
      dispatch(removeActiveAddon(productSku, addonSku, cartIndex)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartWrapper)
