import React from 'react'
import { connect } from 'react-redux'
import QuantityDropdown from './quantity-dropdown'

class QuantityDropdownWrapper extends React.Component {
  render() {
    const { quantity } = this.props
    const dropDownLimit = Array.from({ length: quantity > 10 ? quantity : 10 }, (v, k) => k + 1)
    return <QuantityDropdown { ...this.props } dropDownLimit={ dropDownLimit } />
  }
}

const mapStateToProps = state => {
  return { ...state.cart }
}
export default connect(mapStateToProps)(QuantityDropdownWrapper)
