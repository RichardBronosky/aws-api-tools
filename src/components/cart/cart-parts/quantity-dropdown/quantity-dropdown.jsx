import React from 'react'
import { setNewQuantity } from '../../../../lib/helpers/cart'
import '../../../../assets/css/components/cart/cart-parts/quantity-dropdown.sass'

export default ({ cart, sku, activeAddons, dropDownLimit, quantity, ariaId }) => (
  <div className="quantity-select">
    <label>
      Quantity Select
      <select aria-describedby={ ariaId } value={ quantity } onChange={ e => setNewQuantity(e, cart, sku, activeAddons) }>
        { dropDownLimit.map(num => (
          <option key={ num } value={ parseInt(num) }>
            { num }
          </option>
        )) }
      </select>
    </label>
  </div>
)
