import React from 'react'
import RTGLink from '../../../shared/link'
import classNames from 'classnames'
import { currencyFormatUS } from '../../../../lib/helpers/string-helper'
import '../../../../assets/css/components/checkout/checkout-parts/payment-section/rooms-to-go-credit.sass'
import CheckoutInput from '../checkout-input'
import RTGCreditEntry from './rtg-credit-entry'
import { getRemainingTotal } from '../../../../lib/helpers/checkout/global'
import {
  setOrderFinancePlanInfo,
  getFinanceCodeFromOrder,
  removeFinancingPlan,
} from '../../../../lib/helpers/checkout/payment-section/rtg-finance'
import { getFinancePlans } from '../../../../lib/helpers/finance'
import loaderDark from '../../../../assets/images/loader-dark.svg'
import { setOrderInfo } from '../../../../lib/helpers/checkout/global'

export default class RoomsToGoCredit extends React.Component {
  state = {
    financePlans: [],
    loading: false,
  }

  componentDidMount() {
    const { order } = this.props
    const realFinancePlans = getFinancePlans(0, true)
    this.setState({
      financePlans: realFinancePlans,
    })
    if (order && order.financePlan && order.financePlan.code === '') {
      setOrderFinancePlanInfo({
        code: realFinancePlans[0].financeCode,
        hasPayments: realFinancePlans[0].downPaymentRequired,
      })
    }
  }

  setLoading = loading => this.setState({ loading })

  render() {
    const { order } = this.props
    const { financePlans, loading } = this.state
    const orderFinCode = getFinanceCodeFromOrder()
    const orderAmounts = getRemainingTotal(true, null, true)
    return (
      <>
        <div className="dont-have-rtg">
          <p>Get a Rooms To Go Credit Card by Synchrony Bank:</p>
          <img
            src={ `${ process.env.GATSBY_S3_IMAGE_URL }rtg-cc.png` }
            alt="Rooms To Go Credit Card"
            className="credit-card-image small-12 large-2"
          />
          <RTGLink
            data={ {
              slug: '/credit/options',
              title: 'Rooms To Go Credit Options',
              category: 'credit-card-banner',
              action: 'click',
              label: 'credit options',
            } }
            className="apply-link"
            target="_blank"
          >
            Apply now >
          </RTGLink>
        </div>
        { financePlans && (
          <div className="financing-container">
            { financePlans.map((plan, index) => (
              <div className="financing-section" key={ index }>
                <CheckoutInput
                  type="radio"
                  field="financePlan"
                  label={ plan.siteFriendlyLabel }
                  info={ order }
                  setInfo={ setOrderInfo }
                  name="finance"
                  afterComponent={ <span className="radio-label">
                      <p className="bold">{ plan.siteFriendlyLabel }</p>
                      { orderFinCode === plan.financeCode && (
                        <button
                          className="remove-btn"
                          tabIndex="0"
                          value="Remove Financing Plan"
                          aria-label={ `Remove Financing Plan: ${ plan.siteFriendlyLabel }` }
                          onClick={ () => removeFinancingPlan(this.setLoading) }
                        >
                          Remove
                        </button>
                      ) }
                      { orderFinCode === plan.financeCode && (
                        <>
                          { loading && <img className="loader" alt={ `Removing Finance Plan` } src={ loaderDark } /> }
                          { !loading && (
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                              <title>{ `Successfully submitted ${ plan.siteFriendlyLabel }` }</title>
                              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                          ) }
                        </>
                      ) }
                      { plan.downPaymentRequired && (
                        <>
                          <p className="sub-text">
                            Small down payment required -{ ' ' }
                            { orderAmounts
                              ? currencyFormatUS(orderAmounts.tax + orderAmounts.deliveryCost)
                              : currencyFormatUS(0) }{ ' ' }
                            (shipping & sales tax).
                          </p>
                        </>
                      ) }
                      { !plan.downPaymentRequired && <p className="sub-text">No down payment required</p> }
                    </span> }
                  radioValue={ { code: plan.financeCode, downPaymentRequired: plan.downPaymentRequired } }
                />
                { order.financePlan && order.financePlan.code === plan.financeCode && (
                  <>
                    { (!orderFinCode || orderFinCode !== order.financePlan.code) && (
                      <div
                        className={ classNames('finance', {
                          short: !plan.downPaymentRequired,
                        }) }
                      >
                        { plan.downPaymentRequired && (
                          <p className="financing-step">
                            Equal fixed monthly payments will be made on your Rooms To Go Credit Card.
                          </p>
                        ) }
                        <RTGCreditEntry setRTGCreditInfo={ this.setRTGCreditState } financePlan={ plan } />
                      </div>
                    ) }
                  </>
                ) }
              </div>
            )) }
          </div>
        ) }
      </>
    )
  }
}
