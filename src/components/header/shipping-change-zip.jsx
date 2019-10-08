import React from 'react'
import { connect } from 'react-redux'
import { geoLocation, getCurrentLocation } from '../../lib/helpers/geo-location'
import { addToDataLayer } from '../../lib/helpers/google-tag-manager'
import { setShippingAddress } from '../../redux/modules/location'

import LocationFields from '../shared/location-fields'
import { saveLocalStorage } from '../../lib/helpers/storage'

class ShippingChangeZip extends React.Component {
  state = {
    addressInput: '',
    error: false,
  }

  async handleSubmit(event) {
    event.preventDefault()
    const currentZip = getCurrentLocation().zip
    let err = await geoLocation(this.state.addressInput)
    if (err) {
      this.setState({
        error: true,
      })
      document.getElementById('locationHeader').focus()
    } else {
      saveLocalStorage('changeLocReturn', 'changeLocHeaderBtn')
    }
    addToDataLayer('click', 'header', 'shipping change', `${ currentZip },${ getCurrentLocation().zip }`)
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
      <div>
        <div className="section">
          <div className="deliver-to">
            <h2>
              Ship &amp; Deliver To: <span>{ shipping_address }</span>
            </h2>
          </div>
        </div>
        <div className="section">
          <div className="notice">
            <p>View product availability in your area by entering delivery location.</p>
          </div>
          <div className="form">
            <form onSubmit={ e => this.handleSubmit(e) }>
              <LocationFields
                error={ this.state.error }
                addressInput={ this.state.addressInput }
                onChange={ this.onChange }
                noAutoComplete
                id="Header"
              />
            </form>
          </div>
        </div>
      </div>
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
)(ShippingChangeZip)
