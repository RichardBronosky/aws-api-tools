import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import HoverIntent from 'react-hoverintent'
import LoginForm from '../user/login-form'
import RegisterForm from '../user/register-form'
import SearchForm from '../shared/search-form'
import Cart from './cart'
import ShippingChangeZip from './shipping-change-zip'
import RTGLink from '../shared/link'
import { getLineItemQuantity } from '../../lib/helpers/cart'
import { getFromBrowserStorage } from '../../lib/helpers/storage'
import { contentfulImage } from '../../lib/helpers/contentful'
import { isMobileOnly as browserDetectMobileOnly } from 'react-device-detect'
import { navigate } from '../../lib/helpers/link'

class HeaderMenu extends React.Component {
  state = {
    activeForm: 'signin',
    closeCart: false,
    cartQuantity: 0,
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (
      (this.props.isMobile || this.props.activePopout === 'shipping') &&
      this.node &&
      !this.node.contains(event.target) &&
      this.props.activePopout !== ''
    ) {
      try {
        if (typeof event.target.className === 'string' && !event.target.className.includes(this.props.activePopout)) {
          this.props.setActivePopout('')
        }
      } catch (err) {
        this.props.setActivePopout('')
      }
    }
  }

  onHeaderKeyDown = (event, menu) => {
    let code = event.keyCode || event.which || event
    if (code === 'click') {
      this.props.setActivePopout(menu)
      if (menu === 'cart') {
        this.setState({ closeCart: false })
      }
    }
    if (code === 27) {
      this.props.setActivePopout('')
    }
  }

  render() {
    const {
      navIsActive,
      toggleNavigation,
      activePopout,
      setActivePopout,
      isMobile,
      shipping_address,
      checkout,
    } = this.props
    const cartQuantity = getLineItemQuantity().cart
    const shadowBox = getFromBrowserStorage('local', 'shadowBox') === 'show' && browserDetectMobileOnly
    return (
      <div
        className={ classNames('head--titlebar head-wrapper grid-x', {
          checkout: checkout,
        }) }
      >
        { !checkout && (
          <>
            <div className={ 'head--mobile-menu-icon grid-x small-4' }>
              <div className="small-6 cell border-right">
                <button
                  type="button"
                  tabIndex="0"
                  value="Mobile Menu"
                  aria-label="Mobile Menu"
                  aria-expanded={ navIsActive }
                  onClick={ toggleNavigation }
                >
                  { !navIsActive && (
                    <img className="icon menu" alt="navigation menu open" src={ contentfulImage('/mobile-nav.png') } />
                  ) }
                  { navIsActive && (
                    <img
                      className="icon close"
                      alt="navigation menu close"
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%230053A0' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
                    />
                  ) }
                </button>
              </div>
              <div className="small-6 cell border-right">
                <RTGLink
                  data={ {
                    slug: '/stores',
                    title: 'Store Locator',
                    category: 'header',
                    action: 'rtore locator click',
                    label: 'store locator',
                  } }
                  className="mobile-store-locator"
                >
                  <img
                    className="icon location"
                    src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2052.44%2075.69%22%20fill%3D%22%232f5294%22%3E%3Ctitle%3Eicon-location%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M52.44%2C26.22A26.22%2C26.22%2C0%2C0%2C0%2C0%2C26.22q0%2C.66%2C0%2C1.32c0%2C.44%2C0%2C.87%2C0%2C1.32C0%2C43.34%2C26.22%2C75.69%2C26.22%2C75.69S52.44%2C43.34%2C52.44%2C28.86q0-.67%2C0-1.32T52.44%2C26.22ZM26.22%2C39.52A12.17%2C12.17%2C0%2C1%2C1%2C38.39%2C27.35h0A12.17%2C12.17%2C0%2C0%2C1%2C26.22%2C39.52Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                  />
                </RTGLink>
              </div>
            </div>
            <div className={ 'search desktop cell large-4' }>
              <SearchForm id="search-desktop" addClasses={ { active: true } } />
            </div>
          </>
        ) }
        <div
          className={ classNames({ 'head--logo small-4 cell': !checkout, 'head--logo small-12 cell grid-x': checkout }) }
        >
          <RTGLink
            data={ {
              slug: '/',
              title: 'Rooms To Go Home',
              category: 'header',
              action: 'logo click',
              label: 'logo',
            } }
            className={ classNames({ ' small-4 cell grid-x': checkout }) }
          >
            <div className="header-image-logo">
              <img src={ contentfulImage('/logo.png') } alt="Rooms To Go" className="desktop" />
              <img src={ contentfulImage('/mobile-logo.png?w=200') } alt="Rooms To Go" className="mobile" />
            </div>
          </RTGLink>
          { checkout && (
            <RTGLink
              data={ {
                slug: '/cart',
                title: 'Return to cart',
                category: 'header',
                action: 'return to cart click',
                label: 'return to cart',
              } }
              className="return-to-cart small-8 cell"
            >
              Return to Cart
            </RTGLink>
          ) }
        </div>
        { !checkout && (
          <>
            <div
              className="head--iconbar small-4 cell grid-x"
              ref={ node => {
                this.node = node
              } }
            >
              <div className="head--iconbar-icon head--iconbar-location desktop cell medium-2 large-4 grid-x">
                <button
                  className="head--iconbar-toggle location cell grid-x"
                  value="Store Locator"
                  aria-label="Store Locator"
                  gtm-category="header"
                  gtm-action="location click"
                  gtm-label="location"
                  role="link"
                  onClick={ () => navigate('/stores') }
                >
                  <div className="small-6 cell location-cell">
                    <img
                      className="icon location cell"
                      alt="Store Locations"
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2052.44%2075.69%22%20fill%3D%22%232f5294%22%3E%3Ctitle%3Eicon-location%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M52.44%2C26.22A26.22%2C26.22%2C0%2C0%2C0%2C0%2C26.22q0%2C.66%2C0%2C1.32c0%2C.44%2C0%2C.87%2C0%2C1.32C0%2C43.34%2C26.22%2C75.69%2C26.22%2C75.69S52.44%2C43.34%2C52.44%2C28.86q0-.67%2C0-1.32T52.44%2C26.22ZM26.22%2C39.52A12.17%2C12.17%2C0%2C1%2C1%2C38.39%2C27.35h0A12.17%2C12.17%2C0%2C0%2C1%2C26.22%2C39.52Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                    />
                  </div>
                  <div className="small-6 cell store-location-text">
                    <span className="location-text small-6 cell">Store Locator</span>
                  </div>
                </button>
              </div>
              { /* <div
                className={ classNames(
                  'head--iconbar-icon head--iconbar-profile desktop',
                  {
                    active: activePopout === 'profile',
                  }
                ) }
              >
                <HoverIntent
                  onMouseOver={ () => setActivePopout('profile') }
                  onMouseOut={ () => setActivePopout('') }
                  sensitivity={ 10 }
                  interval={ 150 }
                  timeout={ 100 }
                >
                  <button
                    tabIndex="0"
                    className="head--iconbar-toggle"
                    name="profile_btn"
                    value="View Profile"
                    aria-label="View Profile"
                    aria-expanded={ activePopout === 'profile' }
                  >
                    <i className="icon profile" />
                  </button>
                </HoverIntent>
                <div
                  className="head-popout head--iconbar-popout"
                  onMouseLeave={ _ =>
                    !isMobile ? setActivePopout('profile') : _ }
                >
                  <div className="section no-border buttons">
                    <button
                      tabIndex="0"
                      className={ this.state.activeForm === 'signin' ? 'active' : '' }
                      onClick={ _ => this.setState({ activeForm: 'signin' }) }
                      name="signin_toggle_btn"
                      value="Sign In"
                      aria-label="Sign In"
                    >
                      Sign In
                    </button>
                    <button
                      tabIndex="0"
                      className={ this.state.activeForm === 'createacct' ? 'active' : '' }
                      onClick={ _ => this.setState({ activeForm: 'createacct' }) }
                      name="create_account_toggle_btn"
                      value="Create Account"
                      aria-label="Create Account"
                    >
                      Create Account
                    </button>
                  </div>
                  <div
                    className={ this.state.activeForm === 'signin'
                        ? 'active sign-in'
                        : 'sign-in' }
                  >
                    <div className="section no-border">
                      <div className="notice">
                        Sign in to acccess your wish list, address book, etc.
                      </div>
                    </div>
                    <div className="section">
                      <div className="form">
                        <LoginForm />
                      </div>
                      <a
                        href="/"
                        className="bold-arrow-link"
                        title="forgot password?"
                      >
                        Forgot Password? >
                      </a>
                    </div>
                  </div>
                  <div
                    className={ this.state.activeForm === 'createacct'
                        ? 'active create-account'
                        : 'create-account' }
                  >
                    <div className="section no-border">
                      <div className="notice">
                        Create an account to access your saved cart or Wish List
                        online or in-store! In addition, you can save addresses
                        for quicker and easier checkout, as well as view order
                        status and history.
                      </div>
                    </div>
                    <div className="section">
                      <div className="form">
                        <RegisterForm />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */ }
              <div
                className={ classNames(
                  'head--iconbar-icon cart head--iconbar-cart cell small-6 medium-6 large-2 grid-x',
                  {
                    active: activePopout === 'cart',
                  }
                ) }
              >
                { !isMobile && (
                  <RTGLink
                    data={ {
                      slug: '/cart',
                      title: 'View Cart',
                      category: 'header',
                      action: 'cart interaction',
                      label: 'view full cart',
                    } }
                    className="view-cart cell"
                    aria-label={ `View Cart: ${ cartQuantity } items` }
                    aria-expanded={ activePopout === 'cart' }
                    aria-describedby="cartSubtotal"
                    onKey={ e => this.onHeaderKeyDown(e, 'cart') }
                    onClick={ () => this.onHeaderKeyDown('click', 'cart') }
                    onFocus={ () => {
                      setActivePopout('cart')
                      this.setState({ closeCart: false })
                    } }
                    onKey={ e => {
                      if (e.key == 'Escape' || (e.shiftKey && e.key == 'Tab')) setActivePopout('')
                    } }
                  >
                    <HoverIntent
                      onMouseOver={ () => {
                        setActivePopout('cart')
                        this.setState({ closeCart: false })
                      } }
                      onMouseOut={ () => setActivePopout('') }
                      sensitivity={ 10 }
                      interval={ 150 }
                      timeout={ 100 }
                    >
                      <span className="cart-positioning">
                        <img
                          className="icon cart"
                          alt=""
                          role="presentation"
                          src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctitle%3EAsset%201%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M34.48%2C78.83A10.59%2C10.59%2C0%2C1%2C0%2C45.07%2C89.41%2C10.59%2C10.59%2C0%2C0%2C0%2C34.48%2C78.83Zm0%2C16.17a5.59%2C5.59%2C0%2C1%2C1%2C5.59-5.59A5.6%2C5.6%2C0%2C0%2C1%2C34.48%2C95Z%22%2F%3E%3Cpath%20d%3D%22M78.45%2C78.83A10.59%2C10.59%2C0%2C1%2C0%2C89%2C89.41%2C10.59%2C10.59%2C0%2C0%2C0%2C78.45%2C78.83Zm0%2C16.17A5.59%2C5.59%2C0%2C1%2C1%2C84%2C89.41%2C5.6%2C5.6%2C0%2C0%2C1%2C78.45%2C95Z%22%2F%3E%3Cpath%20d%3D%22M100%2C19.7v0a2.58%2C2.58%2C0%2C0%2C0%2C0-.29%2C1.52%2C1.52%2C0%2C0%2C0%2C0-.21%2C1.83%2C1.83%2C0%2C0%2C0-.08-.25%2C1.87%2C1.87%2C0%2C0%2C0-.07-.22%2C2%2C2%2C0%2C0%2C0-.11-.2%2C1.55%2C1.55%2C0%2C0%2C0-.12-.22l-.16-.18a1.3%2C1.3%2C0%2C0%2C0-.15-.18l-.19-.16-.18-.14a2.25%2C2.25%2C0%2C0%2C0-.21-.12l-.23-.11a1.17%2C1.17%2C0%2C0%2C0-.2-.06L98%2C17.25h0l-.21%2C0-.22%2C0H18L14.86%2C2a2.49%2C2.49%2C0%2C0%2C0-2.45-2H2.5a2.5%2C2.5%2C0%2C0%2C0%2C0%2C5h7.87l3%2C14.55c0%2C.05%2C0%2C.1%2C0%2C.15a2.48%2C2.48%2C0%2C0%2C0%2C.28%2C1.12L21%2C56.71a2.83%2C2.83%2C0%2C0%2C0%2C.05.5l2.75%2C13.51a2.5%2C2.5%2C0%2C0%2C0%2C2.45%2C2H88.76a2.5%2C2.5%2C0%2C0%2C0%2C0-5H28.27L26.49%2C59h64.6a2.42%2C2.42%2C0%2C0%2C0%2C.47-.05l.16%2C0%2C.29-.09.17-.08a1.71%2C1.71%2C0%2C0%2C0%2C.23-.13l.17-.11.2-.17.13-.13a1.92%2C1.92%2C0%2C0%2C0%2C.18-.22%2C1%2C1%2C0%2C0%2C0%2C.11-.15l.13-.24.08-.17a2.76%2C2.76%2C0%2C0%2C0%2C.08-.27%2C1.05%2C1.05%2C0%2C0%2C0%2C.05-.19s0%2C0%2C0%2C0L100%2C20.13a1.64%2C1.64%2C0%2C0%2C0%2C0-.22A1.49%2C1.49%2C0%2C0%2C0%2C100%2C19.7Zm-5.47%2C2.5L89%2C54H25.52L19%2C22.2Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                          gtm-category="header"
                          gtm-action="cart focus"
                          gtm-label="click"
                        />
                        { cartQuantity < 1 && (
                          <div className="round-blue hidden">
                            <p>{ cartQuantity }</p>
                          </div>
                        ) }
                        { cartQuantity > 0 && (
                          <span className="round-blue">
                            <p>{ cartQuantity }</p>
                          </span>
                        ) }
                      </span>
                    </HoverIntent>
                  </RTGLink>
                ) }
                { isMobile && (
                  <>
                    { ' ' }
                    <RTGLink
                      data={ {
                        slug: '/cart',
                        title: 'View Cart',
                        category: 'header',
                        action: 'mobile cart interaction',
                        label: 'view mobile cart',
                      } }
                      className="head--iconbar-toggle cart cell"
                    >
                      { activePopout !== 'cart' && (
                        <img
                          className="icon cart"
                          alt="cart"
                          src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctitle%3EAsset%201%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M34.48%2C78.83A10.59%2C10.59%2C0%2C1%2C0%2C45.07%2C89.41%2C10.59%2C10.59%2C0%2C0%2C0%2C34.48%2C78.83Zm0%2C16.17a5.59%2C5.59%2C0%2C1%2C1%2C5.59-5.59A5.6%2C5.6%2C0%2C0%2C1%2C34.48%2C95Z%22%2F%3E%3Cpath%20d%3D%22M78.45%2C78.83A10.59%2C10.59%2C0%2C1%2C0%2C89%2C89.41%2C10.59%2C10.59%2C0%2C0%2C0%2C78.45%2C78.83Zm0%2C16.17A5.59%2C5.59%2C0%2C1%2C1%2C84%2C89.41%2C5.6%2C5.6%2C0%2C0%2C1%2C78.45%2C95Z%22%2F%3E%3Cpath%20d%3D%22M100%2C19.7v0a2.58%2C2.58%2C0%2C0%2C0%2C0-.29%2C1.52%2C1.52%2C0%2C0%2C0%2C0-.21%2C1.83%2C1.83%2C0%2C0%2C0-.08-.25%2C1.87%2C1.87%2C0%2C0%2C0-.07-.22%2C2%2C2%2C0%2C0%2C0-.11-.2%2C1.55%2C1.55%2C0%2C0%2C0-.12-.22l-.16-.18a1.3%2C1.3%2C0%2C0%2C0-.15-.18l-.19-.16-.18-.14a2.25%2C2.25%2C0%2C0%2C0-.21-.12l-.23-.11a1.17%2C1.17%2C0%2C0%2C0-.2-.06L98%2C17.25h0l-.21%2C0-.22%2C0H18L14.86%2C2a2.49%2C2.49%2C0%2C0%2C0-2.45-2H2.5a2.5%2C2.5%2C0%2C0%2C0%2C0%2C5h7.87l3%2C14.55c0%2C.05%2C0%2C.1%2C0%2C.15a2.48%2C2.48%2C0%2C0%2C0%2C.28%2C1.12L21%2C56.71a2.83%2C2.83%2C0%2C0%2C0%2C.05.5l2.75%2C13.51a2.5%2C2.5%2C0%2C0%2C0%2C2.45%2C2H88.76a2.5%2C2.5%2C0%2C0%2C0%2C0-5H28.27L26.49%2C59h64.6a2.42%2C2.42%2C0%2C0%2C0%2C.47-.05l.16%2C0%2C.29-.09.17-.08a1.71%2C1.71%2C0%2C0%2C0%2C.23-.13l.17-.11.2-.17.13-.13a1.92%2C1.92%2C0%2C0%2C0%2C.18-.22%2C1%2C1%2C0%2C0%2C0%2C.11-.15l.13-.24.08-.17a2.76%2C2.76%2C0%2C0%2C0%2C.08-.27%2C1.05%2C1.05%2C0%2C0%2C0%2C.05-.19s0%2C0%2C0%2C0L100%2C20.13a1.64%2C1.64%2C0%2C0%2C0%2C0-.22A1.49%2C1.49%2C0%2C0%2C0%2C100%2C19.7Zm-5.47%2C2.5L89%2C54H25.52L19%2C22.2Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                          gtm-category="header"
                          gtm-action="cart focus"
                          gtm-label="click"
                          onClick={ () => setActivePopout('') }
                        />
                      ) }
                      { cartQuantity < 1 && (
                        <div className="round-blue hidden" aria-label={ `${ cartQuantity } items in cart` }>
                          <p>{ cartQuantity }</p>
                        </div>
                      ) }
                      { cartQuantity > 0 && (
                        <span className="round-blue" aria-label={ `${ cartQuantity } items in cart` }>
                          <p>{ cartQuantity }</p>
                        </span>
                      ) }
                    </RTGLink>
                  </>
                ) }
                <div
                  className="head-popout head--iconbar-popout"
                  onMouseLeave={ _ => (!isMobile && !this.state.closeCart ? setActivePopout('cart') : _) }
                  onBlur={ e => {
                    if (e.currentTarget.contains(e.relatedTarget)) return
                    !isMobile && !this.state.closeCart ? setActivePopout('cart') : _
                  } }
                  onKeyDownCapture={ e => {
                    if (e.key == 'Escape') {
                      !isMobile && !this.state.closeCart ? setActivePopout('cart') : _
                      e.currentTarget.previousElementSibling.focus()
                    }
                  } }
                >
                  <Cart
                    onClose={ _ => {
                      setActivePopout('')
                      this.setState({ closeCart: true })
                    } }
                  />
                </div>
              </div>
              <div
                className={ classNames(
                  'head--iconbar-icon head--iconbar-shipping cell small-6 medium-6 large-6 grid-x',
                  {
                    active: activePopout === 'shipping',
                  }
                ) }
              >
                <button
                  id="changeLocHeaderBtn"
                  className="head--iconbar-toggle desktop  grid-x cell"
                  name="ship_to_btn"
                  value="Ship & Deliver To"
                  aria-expanded={ activePopout === 'shipping' }
                  onClick={ () => this.onHeaderKeyDown('click', 'shipping') }
                  onKeyDown={ e => this.onHeaderKeyDown(e, 'shipping') }
                >
                  <img
                    className="icon shipping small-5 cell"
                    alt=""
                    aria-hidden="true"
                    role="presentation"
                    src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                    gtm-category="header"
                    gtm-action="shipping focus"
                    gtm-label="click"
                  />
                  <div className="shipping-text small-7">
                    Ship &amp; Deliver To
                    <span className="deliveryLocation "> { shipping_address }</span>
                  </div>
                </button>
                <button
                  tabIndex="0"
                  className="head--iconbar-toggle mobile"
                  name="delivery_btn"
                  value="Delivery"
                  aria-label="Delivery"
                  aria-expanded={ activePopout === 'shipping' }
                  onClick={ _ => {
                    setActivePopout('shipping')
                    navIsActive && toggleNavigation()
                  } }
                >
                  { activePopout !== 'shipping' && (
                    <img
                      className="icon shipping"
                      alt=""
                      aria-hidden="true"
                      role="presentation"
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                      gtm-category="header"
                      gtm-action="shipping focus"
                      gtm-label="click"
                    />
                  ) }
                  { shipping_address && isMobile && activePopout !== 'shipping' && (
                    <div
                      className="round-blue"
                      aria-label={ `State: ${ shipping_address.substr(shipping_address.length - 2) }` }
                    >
                      <p>{ shipping_address.substr(shipping_address.length - 2) }</p>
                    </div>
                  ) }
                  { activePopout === 'shipping' && (
                    <img
                      className="icon close"
                      alt="navigation menu close"
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%230053A0' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
                    />
                  ) }
                </button>
                <div
                  className={ classNames('head-popout head--iconbar-popout', {
                    locationPadding: shadowBox,
                  }) }
                  onBlur={ e => {
                    if (e.currentTarget.contains(e.relatedTarget) || !isMobile) return
                    !isMobile && setActivePopout('shipping')
                  } }
                  onKeyDownCapture={ e => {
                    if (e.key !== 'Escape') return
                    setActivePopout('shipping')
                  } }
                >
                  <ShippingChangeZip />
                </div>
              </div>
            </div>
          </>
        ) }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.location, ...state.global, ...state.cart }
}

export default connect(
  mapStateToProps,
  null
)(HeaderMenu)
