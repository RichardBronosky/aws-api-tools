import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { geoLocation } from '../../../lib/helpers/geo-location'
import { getStockMessage } from '../../../lib/helpers/product'
import LocationFields from '../../shared/location-fields'
import SeeInStores from './product-see-in-stores'
import '../../../assets/css/components/product/product-location.sass'
import { saveLocalStorage } from '../../../lib/helpers/storage'
import { setShippingAddress } from '../../../redux/modules/location'
import { taskDone } from '@helpers/aria-announce'

class ProductLocation extends React.Component {
  state = {
    show: false,
    addressInput: '',
    error: false,
    stockMessage: '',
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
    if (this.props.cart) {
      getStockMessage(this.props.product, this.setStockMessage)
    } else if (this.props.addToCart && this.props.stockMessage) {
      this.setStockMessage(this.props.stockMessage)
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.cart && prevProps.stockMessage !== this.props.stockMessage) {
      this.setStockMessage(this.props.stockMessage)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setStockMessage = message => {
    this.setState({
      stockMessage: message,
    })
  }

  setInputRef(ref) {
    this.inputField = ref
  }

  handleClickOutside = event => {
    if (
      this.node &&
      !this.node.contains(event.target) &&
      typeof event.target.className === 'string' &&
      !event.target.className.includes('location-button')
    ) {
      this.setState({
        show: false,
      })
    }
  }

  handleKeydown = e => {
    if (e.key == 'Escape') {
      this.btn.focus()
      this.setState({ show: false })
    }
    return
  }

  toggleLocationModal = () => {
    this.setState({
      show: !this.state.show,
    })
    try {
      taskDone(
        () => {
          this.inputField.focus()
        },
        100,
        'focusLocation'
      )
    } catch (error) {}
  }

  async handleSubmit(event) {
    event.preventDefault()
    let err = await geoLocation(this.state.addressInput)
    if (err) {
      this.inputField.focus()
      this.setState({
        error: true,
      })
    } else {
      saveLocalStorage('changeLocReturn', 'changeLocationPDPText')
    }
  }

  onChange = event => {
    this.setState({
      error: false,
      addressInput: event.target.value,
    })
  }

  render() {
    const { shipping_address, onSetShippingAddress, product, addToCart, cart, list } = this.props
    const { stockMessage } = this.state
    const addrArr = shipping_address ? shipping_address.split(',') : []
    if (addrArr[0] === '') {
      onSetShippingAddress(addrArr[1])
    }
    const isCrib = product && product.generic_name === 'crib' && product.delivery_type === 'K'
    return (
      <>
        <div className="in-stock instore cell small-12">
          { !cart && !addToCart && product && !product.free_shipping && product.type !== 'room' && (
            <SeeInStores shipping_address={ shipping_address } product={ product } componentPage="pdp" />
          ) }
        </div>
        { !cart && (
          <div className="product-location cell small-12">
            <div className="delivery-info">
              { product && !product.free_shipping && (
                <>
                  <img
                    className="icon shipping"
                    alt=""
                    aria-hidden="true"
                    role="presentation"
                    src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                  />
                  <p>
                    Professional delivery
                    <br />
                    { !isCrib ? <>&amp; set-up to</> : 'to' }
                    <button
                      ref={ btn => {
                        this.btn = btn
                      } }
                      aria-expanded="false"
                      className={ classNames('location-button', {
                        active: this.state.show,
                      }) }
                      onClick={ this.toggleLocationModal }
                    >
                      <span className="hide508">Professional delivery { !isCrib ? 'and setup' : '' }to: </span>
                      { shipping_address }
                    </button>
                  </p>
                </>
              ) }
              { product && product.free_shipping && <p className="free-shipping">Free Shipping</p> }
            </div>
          </div>
        ) }

        { this.state.show && (
          <div
            ref={ node => {
              this.node = node
            } }
            className={ classNames('product-location-popout', {
              error: this.state.error,
            }) }
            onKeyDownCapture={ e => this.handleKeydown(e) }
          >
            <div className="form">
              <form onSubmit={ e => this.handleSubmit(e) }>
                <LocationFields
                  inputRef={ this.setInputRef.bind(this) }
                  error={ this.state.error }
                  addressInput={ this.state.addressInput }
                  onChange={ this.onChange }
                  noAutoComplete={ !list }
                  id="PDP"
                />
              </form>
            </div>
            <button className="close-modal" value="Close" onClick={ () => this.setState({ show: false }) }>
              <img
                className="icon close"
                alt=""
                aira-hidden="true"
                role="presentation"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
              />
              <span className="hide508">Close</span>
            </button>
          </div>
        ) }
        <div className="in-stock cell small-12">
          { stockMessage === 'In stock' && <i className="icon checkmark" /> }
          { (stockMessage === 'Out of stock' || stockMessage === 'Not available in your region') && (
            <i className="icon close" />
          ) }
          { (!stockMessage || stockMessage === '') && <div className="loading" /> }
          { stockMessage && stockMessage.toUpperCase() }
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.location }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetShippingAddress: shipping_address => dispatch(setShippingAddress(shipping_address)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductLocation)
