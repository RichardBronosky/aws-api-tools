import React from 'react'
import classNames from 'classnames'
import { getRelatedOrders } from '../order-status-helper'
import loaderLight from '@images/loader-light.svg'
import './order-search.sass'

export default ({ setOrderSearchState, setOrderStatusState, orderId, phoneNumber, err, loading }) => {
  const orderListRef = React.useRef(null)
  return (
    <div className="grid-x order-search" ref={ orderListRef }>
      <div className="cell small-12 medium-8 large-6 order-status-info">
        <h1>View Order Status</h1>
        <p>
          Enter your order information to see your order details. You can pay an open balance, see your delivery date,
          and check your delivery timeframe. History is available for orders created within the last 180 days.
        </p>
        <form className="grid-x cell small-12">
          { err && <span className="error">{ err }</span> }
          <label className="cell small-12">Order Number (ex: 12345678i)</label>
          <input
            className="cell small-12"
            type="text"
            name="order_number"
            maxLength={ 20 }
            id="order_status_number"
            onChange={ e => setOrderSearchState({ orderId: e.target.value }) }
          />
          <label className="cell small-12">Phone Number (ex: 8135551234)</label>
          <input
            className={ classNames('cell small-12', { error: err && err.includes('phone') }) }
            type="tel"
            name="order_phone_number"
            onChange={ e => setOrderSearchState({ phoneNumber: e.target.value }) }
          />
          <button
            className="primary"
            onClick={ e =>
              getRelatedOrders(e, orderId, phoneNumber, loading, setOrderStatusState, setOrderSearchState, orderListRef) }
          >
            { !loading ? 'Find Order' : <img className="loader" alt="loading matching orders" src={ loaderLight } /> }
          </button>
        </form>
      </div>
      <div className="cell small-12 medium-4 large-6 help-text">
        <div className="background-box">
          <h2>Need Help?</h2>
          <br />
          <p>
            Customer Care Center:
            <br />
            <a href="tel:(800) 766-6786"> (800) 766-6786</a>
          </p>
        </div>
      </div>
    </div>
  )
}
