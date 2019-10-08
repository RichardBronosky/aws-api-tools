import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { removeFromCart } from '../../../lib/helpers/cart'
import '../../../assets/css/components/cart/cart-parts/remove-from-cart.sass'

const RemoveFromCart = ({ product, index, headerCart, ariaId }) => (
  <button
    value="Remove From Cart"
    aria-describedby={ ariaId }
    className={ classNames({ 'remove-btn': !headerCart, close: headerCart }) }
    onClick={ () => removeFromCart(product, index) }
  >
    { !headerCart ? 'remove ' : '' }
    <span className="hide508">{ headerCart ? 'remove' : '' } from cart</span>
  </button>
)

export default RemoveFromCart

RemoveFromCart.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  headerCart: PropTypes.bool,
  ariaId: PropTypes.string,
}
