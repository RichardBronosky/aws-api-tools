import React from 'react'
import { connect } from 'react-redux'
import { getStore } from '../../../../../lib/helpers/store-locator'
import DistributionCenterPopup from './distribution-center-popup'
import '../../../../../assets/css/components/checkout/checkout-parts/delivery-section/distribution-center-popup.sass'

class DistributionCenterPopupWrapper extends React.Component {
  state = {
    open: false,
  }

  togglePopup = e => {
    e.preventDefault()
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    const store = getStore(this.props.order)
    return <DistributionCenterPopup togglePopup={ this.togglePopup } store={ store } open={ this.state.open } />
  }
}

const mapStateToProps = state => {
  return { order: state.checkout.order }
}

export default connect(mapStateToProps)(DistributionCenterPopupWrapper)
