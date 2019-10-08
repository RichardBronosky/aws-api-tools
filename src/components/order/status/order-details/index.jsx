import React from 'react'
import OrderProductInfoList from '../order-product-info-list'
import { getDateFull, getDateCalendarFormat } from '../../../../lib/helpers/date'
import { currencyFormatUS } from '../../../../lib/helpers/string-helper'
import { viewOrderList, getFinDepositTotal, getPaymentType, getOtherPayments } from '../order-status-helper'
import './order-details.sass'

export default ({ order, setOrderStatusState }) => {
  const [expandFinance, setExpandFinance] = React.useState(false)
  const [expandOther, setExpandOther] = React.useState(false)
  const otherPayments = getOtherPayments(order)
  return (
    <>
      { order && (
        <div className="grid-x cell small-12 order-details">
          <div className="grid-x cell small-12 order-status-detailed-header">
            <div className="cell small-12 medium-6 large-6 order-number">
              <h2>{ `Order # ${ order.OrderNumber }` }</h2>
              <p className="ordered-on">{ `Ordered on ${ getDateFull(order.OrderDate) }` }</p>
            </div>
            <div className="cell small-12 medium-6 large-6">
              <button className="primary" onClick={ () => viewOrderList(setOrderStatusState) }>
                { '< Back to Orders' }
              </button>
            </div>
          </div>
          <div className="grid-x cell small-12 order-status-payment-history">
            <div className="cell small-12">
              <h3>Payment History</h3>
            </div>
            <div className="grid-x cell small-12 medium-6 large-6">
              { (order.Deposits || order.GCDeposits) && otherPayments.length > 0 && (
                <div className="payment-section">
                  <div className="cell small-12">
                    <strong>Other Payments</strong>
                  </div>
                  <div className="cell small-12">
                    { currencyFormatUS(
                      order.FinDeposits && order.FinDeposits.Deposit.length > 0
                        ? order.OrderTotal - getFinDepositTotal(order.FinDeposits.Deposit)
                        : order.OrderTotal
                    ) }{ ' ' }
                    (
                    <button
                      className="other-payment-details-expander"
                      tabIndex="0"
                      aria-expanded={ expandOther }
                      aria-controls="other-payment-details-accordion"
                      onClick={ () => setExpandOther(!expandOther) }
                    >
                      { `${ expandOther ? 'hide' : 'see' } details` }
                    </button>
                    )
                  </div>
                  <div id="other-payment-details-accordion">
                    { expandOther &&
                      otherPayments.map(dep => (
                        <div key={ dep.AuthorizedDate + dep.AuthorizedAmount } className="payment">
                          { dep && (
                            <div>
                              <div className="cell small-12"> { getDateCalendarFormat(dep.AuthorizedDate) } </div>
                              <div className="cell small-12"> { getPaymentType(dep) } </div>
                              { Number(dep.AuthorizedAmount) < 0 && (
                                <div className="cell small-12">({ currencyFormatUS(dep.AuthorizedAmount) })</div>
                              ) }
                              { Number(dep.AuthorizedAmount) >= 0 && (
                                <div className="cell small-12">{ currencyFormatUS(dep.AuthorizedAmount) }</div>
                              ) }
                            </div>
                          ) }
                        </div>
                      )) }
                  </div>
                </div>
              ) }
              { order.FinDeposits && order.FinDeposits.Deposit.length > 0 && (
                <div className="payment-section">
                  <div className="cell small-12">
                    <strong>RTG Finance</strong>
                  </div>
                  <div className="cell small-12">
                    { currencyFormatUS(getFinDepositTotal(order.FinDeposits.Deposit)) } (
                    <button
                      className="finance-details-expander"
                      tabIndex="0"
                      aria-expanded={ expandFinance }
                      aria-controls="finance-details-accordion"
                      onClick={ () => setExpandFinance(!expandFinance) }
                    >
                      { `${ expandFinance ? 'hide' : 'see' } details` }
                    </button>
                    )
                  </div>
                  <div id="finance-details-accordion">
                    { expandFinance &&
                      order.FinDeposits.Deposit.map(dep => (
                        <div key={ dep.AuthorizedDate + dep.AuthorizedAmount } className="payment">
                          <div className="cell small-12">{ getDateCalendarFormat(dep.AuthorizedDate) }</div>
                          { Number(dep.AuthorizedAmount) < 0 && (
                            <div className="cell small-12">({ currencyFormatUS(dep.AuthorizedAmount) })</div>
                          ) }
                          { Number(dep.AuthorizedAmount) >= 0 && (
                            <div className="cell small-12">{ currencyFormatUS(dep.AuthorizedAmount) }</div>
                          ) }
                        </div>
                      )) }
                  </div>
                </div>
              ) }
            </div>
            <div className="cell small-12 medium-6 large-6">
              <span>
                <strong>Note: </strong>
                Delivery dates on orders with an open balance are subject to change. Call Customer Care if you need help
                at <a href="tel:(800)-766-6786">(800)-766-6786</a>.
              </span>
            </div>
          </div>
          <div className="grid-x cell small-12 order-status-delivery-setup">
            <div className="cell small-12">
              <h3>Delivery & Setup</h3>
            </div>
            <div className="grid-x cell small-12 medium-6 large-6">
              <div className="cell small-12 bold">
                <strong>SHIPPED TO</strong>
              </div>
              <div className="cell small-12">
                { order.Customer && (
                  <p>
                    { order.Customer.FirstName } { order.Customer.LastName }
                  </p>
                ) }
                { order.DeliveryAddress && (
                  <div className="order-status-delivery-address">
                    <p>{ order.DeliveryAddress.Address1 }</p>
                    <p>{ order.DeliveryAddress.Address2 }</p>
                    <p>
                      { order.DeliveryAddress.City }, { order.DeliveryAddress.State }, { order.DeliveryAddress.Zip }
                    </p>
                  </div>
                ) }
              </div>
            </div>
            { order.DeliveryType !== 'O' && order.DeliveryType !== 'U' && (
              <div className="cell small-12 medium-6">
                <strong>Scheduled Delivery Date</strong>
                <p>
                  Contact Customer Service to Schedule a Delivery Date - <a href="tel:(800)-766-6786">(800)-766-6786</a>
                </p>
              </div>
            ) }
            { order.DeliveryType === 'O' && (
              <div className="cell small-12 medium-6">
                <strong>Ships direct from vendor.</strong>
              </div>
            ) }
            { order.DeliveryType === 'U' && (
              <div className="cell small-12 medium-6">
                <strong>Ships via UPS.</strong>
              </div>
            ) }
          </div>
          <div className="grid-x cell small-12 order-status-product-info">
            <OrderProductInfoList order={ order } />
          </div>
        </div>
      ) }
    </>
  )
}
