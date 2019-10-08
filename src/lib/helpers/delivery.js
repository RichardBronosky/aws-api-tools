import { getFromBrowserStorage } from './storage'

export const getDeliveryDate = deliveryInfo => {
  const storageDeliveryInfo = getFromBrowserStorage('session', deliveryInfo)
  let newDeliveryInfo = deliveryInfo
  if (
    deliveryInfo &&
    deliveryInfo.deliveryDate.readable === '' &&
    storageDeliveryInfo &&
    storageDeliveryInfo.deliveryDate &&
    storageDeliveryInfo.deliveryDate.readable !== ''
  ) {
    newDeliveryInfo = storageDeliveryInfo
  }
  if (newDeliveryInfo && newDeliveryInfo.dates.length > 0) {
    let storedDate = newDeliveryInfo.dates[0]
    let expressDate
    if (newDeliveryInfo.pickup) {
      storedDate = newDeliveryInfo.dates.filter(date => date.isPickup)[0]
    } else {
      const expressDates = newDeliveryInfo.dates.filter(date => date.isExpressDelivery)
      expressDate = expressDates.length > 0 ? expressDates[0] : null
      storedDate = newDeliveryInfo.dates.filter(date => date.isStandardDelivery && !date.isExpressDelivery)[0]
    }
    const selectedDate = newDeliveryInfo.deliveryDate.date
    if (
      newDeliveryInfo.deliveryDate.readable !== '' &&
      selectedDate >= ((expressDate && expressDate.date) || storedDate.date)
    ) {
      return {
        readable: newDeliveryInfo.deliveryDate.readable,
        date: selectedDate,
      }
    }
    return {
      readable: storedDate.readable,
      date: storedDate.date,
    }
  }
  return {
    readable: 'No delivery dates avaliable.',
    date: new Date().toISOString().split('T')[0],
  }
}
