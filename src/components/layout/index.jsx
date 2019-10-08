import React, { Component } from 'react'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie'
import * as Sentry from '@sentry/browser'
import { abbreviateState } from '../../lib/helpers/geo-location'
import { getLineItemQuantity } from '../../lib/helpers/cart'
import { getFromBrowserStorage } from '../../lib/helpers/storage'
import { setShippingAddress } from '../../redux/modules/location'
import { setCart } from '../../redux/modules/cart'
import { setLocation } from '../../redux/modules/location'
import { setOrder } from '../../redux/modules/checkout'
import Layout from './layout'

class LayoutWrapper extends Component {
  state = {
    scrolled: false,
    fadeOut: false,
    location: '',
  }

  componentDidMount() {
    const {
      rtg_location,
      order,
      shipping_address,
      cart,
      isLandscape,
      onSetCart,
      onSetLocation,
      onSetOrder,
      onSetShippingAddress,
    } = this.props
    const cookies = new Cookies()
    const userId = getFromBrowserStorage('local', 'uuid')
    if (process.env.NODE_ENV === 'development') {
      if (!cookies.get('session_id')) {
        cookies.set('session_id', 'e5d49640-5af6-11e9-b882-6197050ecff1', { path: '/' })
      }
      if (!cookies.get('TL_RTG')) {
        cookies.set('TL_RTG', 'c823fdec-3136-ed38-8477-601659e5cb70', { path: '/' })
      }
    }
    Sentry.init({
      dsn: process.env.GATSBY_SENTRY_DNS_URL,
      environment: process.env.GATSBY_ENV_SHORT,
      release: process.env.GATSBY_RELEASE_VERSION,
    })
    Sentry.configureScope(scope => {
      if (userId) {
        scope.setUser({ id: userId })
      }
    })
    if (isLandscape) {
      window.addEventListener('scroll', this.updateScrollPosition)
    }
    let changeLocRefresh = getFromBrowserStorage('local', 'changeLocReturn')
    if (changeLocRefresh) {
      try {
        document.getElementById(changeLocRefresh).focus()
        localStorage.removeItem('changeLocReturn')
      } catch (err) {}
    }

    const rtg_location_cookie = cookies.get('rtg_location')
    if (rtg_location_cookie) {
      const shippingAddress = `${ rtg_location_cookie.city }, ${ abbreviateState(rtg_location_cookie.state) }`
      if (shippingAddress !== shipping_address) {
        onSetShippingAddress(`${ rtg_location_cookie.city }, ${ abbreviateState(rtg_location_cookie.state) }`)
      }
    }
    if (rtg_location_cookie && rtg_location.zip !== rtg_location_cookie.zip) {
      onSetLocation(rtg_location_cookie)
    }
    if (process.env.NODE_ENV === 'development' && !rtg_location_cookie) {
      onSetLocation()
    }
    const cartStorage = getFromBrowserStorage('local', 'cart')
    if (
      cartStorage &&
      cartStorage.cartItems &&
      JSON.stringify(cart.cartItems) !== JSON.stringify(cartStorage.cartItems)
    ) {
      onSetCart(cartStorage)
    }
    const orderStorage = getFromBrowserStorage('session', 'order')
    if (orderStorage && orderStorage.orderId && JSON.stringify(order) !== JSON.stringify(orderStorage)) {
      onSetOrder(orderStorage)
    }
  }

  componentDidUpdate(prevProps) {
    const { isLandscape } = this.props
    if (prevProps.isLandscape !== isLandscape && isLandscape) {
      window.addEventListener('scroll', this.updateScrollPosition)
    } else if (prevProps.isLandscape !== isLandscape && !isLandscape) {
      window.removeEventListener('scroll', this.updateScrollPosition)
    }
  }

  shouldComponentUpdate(nextProps) {
    const { cart, order } = this.props
    if (nextProps.cart !== cart || nextProps.order !== order) {
      return false
    }
    return true
  }

  updateScrollPosition = () => {
    if (window.scrollY > 150 && !this.state.scrolled) {
      this.setState({
        scrolled: true,
      })
    } else if (window.scrollY < 150 && this.state.scrolled) {
      this.setState({
        scrolled: false,
        fadeOut: true,
      })
    }
  }

  render() {
    const cartQuantity = getLineItemQuantity().cart
    return <Layout data={ this.props } cartQuantity={ cartQuantity } />
  }
}

const mapStateToProps = state => {
  return {
    isLandscape: state.global.isLandscape,
    isMobile: state.global.isMobile,
    showSearchResults: state.global.showSearchResults,
    rtg_location: state.location.rtg_location,
    shipping_address: state.location.shipping_address,
    order: state.checkout.order,
    cart: state.cart.cart,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetShippingAddress: shipping_address => dispatch(setShippingAddress(shipping_address)),
    onSetLocation: location => dispatch(setLocation(location)),
    onSetCart: cart => dispatch(setCart(cart)),
    onSetOrder: order => dispatch(setOrder(order)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutWrapper)
