import { getOrder } from '../global'

export const redactCCFromOrder = order => {
  let reportOrder = order
  if (reportOrder && reportOrder.paymentInfo) {
    let cc = reportOrder.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2')
    if (cc && cc.length > 0) {
      cc = cc[0]
      if (cc.paymentProperties && cc.paymentProperties.token) {
        reportOrder.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2')[0].paymentProperties = {}
      }
    }
  }
  return reportOrder
}

export const getCreditCardDecision = (orderIn = null) => {
  let decision = false
  let order
  if (orderIn) {
    order = orderIn
  } else {
    order = getOrder()
  }
  if (order && order.paymentInfo && order.paymentInfo.length > 0) {
    const credit = order.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2')[0]
    if (credit && credit.paymentProperties && credit.paymentProperties.token) {
      decision = true
    }
  }
  return decision
}
