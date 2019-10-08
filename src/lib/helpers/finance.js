import { getFromBrowserStorage } from './storage'
import { getCurrentLocation } from './geo-location'
import { getCartTotal, getCart } from './cart'
import { getRemainingTotal } from './checkout/global'

export const getFinancingPriority = (financePlans, total, noThreshold) => {
  const order = getFromBrowserStorage('session', 'order')
  if (order && order.promotions && order.promotions.totalSavings) {
    total -= order.promotions.totalSavings
  }
  let newFinancePlans = []
  let financePlanCodes = []
  for (let i = 0, n = financePlans.length; i < n; i++) {
    if (!financePlanCodes.includes(financePlans[i].financeCode)) {
      financePlanCodes.push(financePlans[i].financeCode)
    }
  }
  for (let i = 0, n = financePlanCodes.length; i < n; i++) {
    let priority = 0
    let index = 0
    const plans = financePlans.filter(plan => plan.financeCode === financePlanCodes[i])
    for (let x = 0, y = plans.length; x < y; x++) {
      const planPriority = parseInt(plans[x].priority)
      if (priority < planPriority) {
        priority = planPriority
        index = x
      }
    }
    if (
      ((total ? total : (order && order.total) || 0) >= plans[index].threshold || noThreshold) &&
      newFinancePlans.filter(plan => plan.financeCode === plans[index].financeCode).length < 1
    ) {
      if (plans[index].downPaymentRequired) {
        newFinancePlans.unshift(plans[index])
      } else if (!plans[index].downPaymentRequired) {
        newFinancePlans.push(plans[index])
      }
    }
  }
  let downPaymentPlans = newFinancePlans.filter(plan => plan.downPaymentRequired)
  let normalPlans = newFinancePlans.filter(plan => !plan.downPaymentRequired)
  let primaryDownPayment, primaryNormal
  if (downPaymentPlans.length > 1) {
    for (let i = 0, n = downPaymentPlans.length; i < n; i++) {
      primaryDownPayment = !primaryDownPayment
        ? downPaymentPlans[i]
        : downPaymentPlans[i].threshold > primaryDownPayment.threshold
        ? downPaymentPlans[i].threshold
        : primaryDownPayment
    }
  } else {
    primaryDownPayment = downPaymentPlans[0]
  }
  if (normalPlans.length > 1) {
    for (let i = 0, n = normalPlans.length; i < n; i++) {
      primaryNormal = !primaryNormal
        ? normalPlans[i]
        : normalPlans[i].threshold > primaryNormal.threshold
        ? normalPlans[i].threshold
        : primaryNormal
    }
  } else {
    primaryNormal = normalPlans[0]
  }
  return [primaryDownPayment, primaryNormal]
}

export const getFinancePlansFromRegion = () => {
  const financePlanFeed = require('../generators/data/finance-plan-feed.json')
  let financePlans = []
  if (financePlanFeed) {
    const loc = getCurrentLocation()
    if (loc) {
      financePlans = financePlanFeed[`${ loc.region.toLowerCase() }${ loc.price_zone }`]
        ? financePlanFeed[`${ loc.region.toLowerCase() }${ loc.price_zone }`]
        : financePlanFeed[`${ loc.region.toLowerCase() }0`] || financePlanFeed['fl0']
    } else {
      financePlans = financePlanFeed['fl0']
    }
  }
  return financePlans
}

export const getFinancePlans = (price = 0, cart = false, noThreshold = false) => {
  let realFinancePlans = []
  const financePlans = getFinancePlansFromRegion()
  if (financePlans && financePlans.length > 0) {
    realFinancePlans = financePlans
    if (realFinancePlans && realFinancePlans.length > 0) {
      const cartTotal = getCartTotal(getCart())
      const orderValues = getRemainingTotal(false, cartTotal, false, false)
      const totalForFin = orderValues.total + price
      realFinancePlans = getFinancingPriority(financePlans, cart ? orderValues.total : totalForFin, noThreshold)
    }
  }
  return realFinancePlans
}

export const productFinancing = price => {
  let finance = { financeAmount: 0, showFinance: false }
  const realFinancePlans = getFinancePlans(price)
  if (realFinancePlans && realFinancePlans.length > 0) {
    const finForCalc = realFinancePlans.filter(plan => plan && typeof plan !== 'undefined' && plan.downPaymentRequired)
    if (finForCalc && finForCalc.length > 0) {
      let financeAmount = 0
      if (finForCalc[0].numberOfMonths > 0) {
        financeAmount = Math.ceil(price / parseInt(finForCalc[0].numberOfMonths))
      }
      finance = {
        financeAmount: financeAmount,
        showFinance: financeAmount >= 10,
      }
    }
  }
  return finance
}

export const getFinanceMarketingMessageData = () => {
  const financePlans = getFinancePlans()
  if (financePlans && financePlans.length > 0) {
    const downPayment = financePlans.filter(plan => plan && typeof plan !== 'undefined' && plan.downPaymentRequired)
    if (downPayment && downPayment.length > 0) {
      return {
        siteFriendlyLabel: downPayment[0].siteFriendlyLabel,
        marketingMessage:
          downPayment[0].marketingMessage &&
          downPayment[0].marketingMessage.markdown &&
          downPayment[0].marketingMessage.markdown.childMarkdownRemark &&
          downPayment[0].marketingMessage.markdown.childMarkdownRemark.html,
      }
    } else {
      return (
        financePlans[0] && {
          siteFriendlyLabel: financePlans[0].siteFriendlyLabel,
          marketingMessage:
            financePlans[0].marketingMessage &&
            financePlans[0].marketingMessage.markdown &&
            financePlans[0].marketingMessage.markdown.childMarkdownRemark &&
            financePlans[0].marketingMessage.markdown.childMarkdownRemark.html,
        }
      )
    }
  }
}
