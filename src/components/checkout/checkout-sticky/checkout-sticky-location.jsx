import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { geoLocation } from '../../../lib/helpers/geo-location'
import { setShippingAddress } from '../../../redux/modules/location'
import '../../../assets/css/components/checkout/checkout-sticky/checkout-sticky-location.sass'

import LocationFields from '../../shared/location-fields'
import { saveLocalStorage } from '../../../lib/helpers/storage'

class CheckoutStickyLocation extends React.Component {
  state = {
    show: false,
    addressInput: '',
    error: false,
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
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

  toggleLocationModal = () => {
    this.setState({
      show: !this.state.show,
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    let err = await geoLocation(this.state.addressInput)
    if (err) {
      this.setState({
        error: true,
      })
      document.getElementById('locationCheckout').focus()
    } else {
      saveLocalStorage('changeLocReturn', 'UnknownLocation?')
    }
  }

  onChange = event => {
    this.setState({
      error: false,
      addressInput: event.target.value,
    })
  }

  render() {
    const { shipping_address, onSetShippingAddress } = this.props
    const addrArr = shipping_address ? shipping_address.split(',') : []
    if (addrArr[0] === '') {
      onSetShippingAddress(addrArr[1])
    }
    return (
      <>
        <div className="cart-location cell small-12">
          <div className="delivery-info">
            DELIVER TO
            <button
              className={ classNames('location-button', {
                active: this.state.show,
              }) }
              onClick={ this.toggleLocationModal }
            >
              { shipping_address }
            </button>
          </div>
        </div>
        { this.state.show && (
          <div
            ref={ node => {
              this.node = node
            } }
            className={ classNames('location-popout', {
              error: this.state.error,
            }) }
          >
            <div className="form">
              <form onSubmit={ e => this.handleSubmit(e) }>
                <LocationFields
                  error={ this.state.error }
                  addressInput={ this.state.addressInput }
                  onChange={ this.onChange }
                  noAutoComplete
                  id="Checkout"
                />
              </form>
            </div>
          </div>
        ) }
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
)(CheckoutStickyLocation)
